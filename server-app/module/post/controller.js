const dateTime = require('node-datetime')
const slugify = require('slugify')
const mongoose = require('mongoose')
const fs = require('fs')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const SITE_CONFIG = require('../../config/site-config')
const {
  mediaUpload
} = require('../../lib/media-upload')
const session = require('../../lib/session')
const {
  generatePostSlug,
  generatePageSlug,
} = require('../../lib/slug')
const permission = require('../../lib/permission')

const query = require('./query')


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
  let post = await query.getDocument(req.params.id)
  if (post.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Post not found',
    })
    return
  }
  res.send({
    data: post,
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
  let bodyPostTitle = req.body.post_title
  if (!bodyPostTitle) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at create post',
    })
    return
  }
  let newPostSlug = slugify(bodyPostTitle, {
    lower: true
  })
  let slug = await generatePostSlug(null, newPostSlug)
  if (slug.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at create post',
    })
    return
  }
  req.body.post_date = dateTime.create().format('Y-m-d H:M:S')
  req.body.post_slug = slug
  req.body.post_user_ref = req.session.user.user_id
  let post = await query.postDocument(req.body)
  if (post.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at create post',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'New post registered',
    data: {
      id: post.id
    },
  })
  res.pushBroadcastMessage({
    channel: 'post-post',
    data: {
      data: post
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
  let totalItems = await query.getTotalDocuments()
  let ascSort = -1
  let items = await query.getDocumentsPaged({
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    sort: {
      'post_date': ascSort
    },
  })
  if (items.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the posts',
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
  let newPostSlug = slugify(req.body.post_title, {
    lower: true
  })
  let slug = await generatePostSlug(req.params.id, newPostSlug)
  if (slug.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error updating post',
    })
    return
  }
  let objectData = {
    id: req.params.id,
    update_fields: {
      post_title: req.body.post_title,
      post_content: req.body.post_content,
      post_status: req.body.post_status,
      post_thumbnail: req.body.post_thumbnail,
      post_slug: slug,
    }
  }
  let post = await query.putDocument(objectData)
  if (post.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'Post updated',
  })
  res.pushBroadcastMessage({
    channel: 'post-put',
    data: {
      data: post
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
  let post = await query.deleteDocument(req.params.id)
  if (post.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error deleting post',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'Post deleted',
  })
  res.pushBroadcastMessage({
    channel: 'post-delete',
    data: {
      data: post
    },
  })
}
