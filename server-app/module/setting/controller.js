const dateTime = require('node-datetime')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const session = require('../../lib/session')
const permission = require('../../lib/permission')
const sessionQuery = require('../../query/session-query')

const query = require('./query')


exports.getSettings = async (req, res) => {
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
  let settings = await query.getAll()
  if (settings.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Settings not found',
    })
    return
  }
  res.send({
    data: settings,
    status_code: 0,
    status_msg: '',
  })
}

exports.updateSettings = async (req, res) => {
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
  if (!req.body)
    return

  let settings = await query.update({
    id: req.body.id,
    update_fields: req.body,
  })
  if (settings.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'It could not update the settings',
    })
    return
  }
  DASHBOARD_ADMIN_CONFIG.loadDashboardSettings()
  res.send({
    status_code: 0,
    status_msg: 'Settings updated',
  })
  res.pushBroadcastMessage({
    channel: 'settings-put',
    data: {
      data: settings
    },
  })
}
