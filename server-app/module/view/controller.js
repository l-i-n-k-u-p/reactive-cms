const dateTime = require('node-datetime')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const session = require('../../lib/session')
const permission = require('../../lib/permission')
const sessionQuery = require('../../query/session-query')

const query = require('./query')


exports.getViewNames = async (req, res) => {
  let views = await query.getAll()
  if (views.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Views not found',
    })
    return
  }
  res.send({
    items: views,
    status_code: 0,
    status_msg: '',
  })
}

exports.getViewByID = async (req, res) => {
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
  let view = await query.getByID(req.params.id)
  if (view.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'View not found',
    })
    return
  }
  res.send({
    data: view,
    status_code: 0,
    status_msg: '',
  })
}

exports.addNewView = async (req, res) => {
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
  let view = await query.create(req.body)
  if (view.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at create view',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'New view registered',
    data: {
      id: view.id
    },
  })
  res.pushBroadcastMessage({
    channel: 'view-post',
    data: {
      data: view
    },
  })
}

exports.getViewsByPage = async (req, res) => {
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
  let totalItems = await query.getTotalItems()
  let ascSort = -1
  let items = await query.getItemsByPage({
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    sort: {
      _id: ascSort
    },
  })
  if (items.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the views',
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

exports.updateViewByID = async (req, res) => {
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
  let objectData = {
    id: req.params.id,
    update_fields: {
      view_name: req.body.view_name,
      view_description: req.body.view_description,
    }
  }
  let view = await query.updateByID(objectData)
  if (view.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'View updated',
  })
  res.pushBroadcastMessage({
    channel: 'view-put',
    data: {
      data: view
    },
  })
}

exports.deleteViewByID = async (req, res) => {
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
  let view = await query.deleteByID(req.params.id)
  if (view.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error deleting view',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'View deleted',
  })
  res.pushBroadcastMessage({
    channel: 'view-delete',
    data: {
      data: view
    },
  })
}
