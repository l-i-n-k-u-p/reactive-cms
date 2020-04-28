const dateTime = require('node-datetime')
const slugify = require('slugify')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const SITE_CONFIG = require('../../config/site-config')
const websiteTemplates = require('../../config/website-templates')
const {
  generatePostSlug,
  generatePageSlug,
} = require('../../lib/slug')
const permission = require('../../lib/permission')

const pageQuery = require('./query')


exports.getDocument = async (req, res) => {
  let hasPermission = permission.canUser({
    permission: 'r',
    req: req,
    res: res,
  })
  if (!hasPermission) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let page = await pageQuery.getDocument(req.params.id)
  if (page.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Page not found',
    })
    return
  }
  res.send({
    data: page,
    status_code: 0,
    status_msg: '',
  })
}

exports.postDocument = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return
  }
  let hasPermission = permission.canUser({
    permission: 'c',
    req: req,
    res: res,
  })
  if (!hasPermission) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let newPostSlug = slugify(req.body.page_title, {
    lower: true
  })
  let slug = await generatePageSlug(null, newPostSlug)
  req.body.page_date = dateTime.create().format('Y-m-d H:M:S')
  req.body.page_slug = slug
  req.body.page_user_ref = req.session.user.user_id
  let page = await pageQuery.postDocument(req.body)
  if (page.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at create page',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'New page registered',
    data: {
      id: page.id
    },
  })
  res.pushBroadcastMessage({
    channel: 'page-post',
    data: {
      data: page
    },
  })
}

exports.getDocumentsPaged = async (req, res) => {
  let hasPermission = permission.canUser({
    permission: 'r',
    req: req,
    res: res,
  })
  if (!hasPermission) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let totalItems = await pageQuery.getTotalDocuments()
  let ascSort = -1
  let items = await pageQuery.getDocumentsPaged({
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    sort: {
      'page_date': ascSort
    },
  })
  if (items.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the pages',
    })
    return
  }
  res.send({
    items: items,
    total_pages: Math.ceil(totalItems / DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
    items_skipped: skipItems,
    total_items: totalItems,
    status_code: 0,
    status_msg: '',
  })
}

exports.putDocument = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return
  }
  let hasPermission = permission.canUser({
    permission: 'u',
    req: req,
    res: res,
  })
  if (!hasPermission) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let newPostSlug = slugify(req.body.page_title, {
    lower: true
  })
  let slug = await generatePageSlug(req.params.id, newPostSlug)
  let page = await pageQuery.updateDocument({
    id: req.params.id,
    update_fields: {
      page_title: req.body.page_title,
      page_content: req.body.page_content,
      page_status: req.body.page_status,
      page_thumbnail: req.body.page_thumbnail,
      page_template: req.body.page_template,
      page_gallery: req.body.page_gallery,
      page_slug: slug
    }
  })
  if (page.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'Page updated',
  })
  res.pushBroadcastMessage({
    channel: 'page-put',
    data: {
      data: page
    },
  })
}

exports.deleteDocument = async (req, res) => {
  let hasPermission = permission.canUser({
    permission: 'd',
    req: req,
    res: res,
  })
  if (!hasPermission) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let page = await pageQuery.deleteDocument(req.params.id)
  if (page.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at delete page',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'Page deleted',
  })
  res.pushBroadcastMessage({
    channel: 'page-delete',
    data: {
      data: page
    },
  })
}

exports.getTemplateFileNames = async (req, res) => {
  res.send({
    items: websiteTemplates.templates,
  })
}
