
const dateTime = require('node-datetime')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const SITE_CONFIG = require('../../config/site-config')

const session = require('../../lib/session')
const permission = require('../../lib/permission')
const sessionQuery = require('../../module/session/query')

const query = require('./query')


exports.getSiteSettings = async (req, res) => {
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
  let siteSettings = await query.getAll()
  if (siteSettings.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Site settings not found',
    })
    return
  }
  res.send({
    data: siteSettings,
    status_code: 0,
    status_msg: '',
  })
}

exports.updateSiteSettings = async (req, res) => {
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
  let siteSettings = await query.update({
    id: req.body.id,
    update_fields: req.body,
  })
  if (siteSettings.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'It could not update the site settings',
    })
    return
  }
  SITE_CONFIG.loadSiteSettings()
  res.send({
    status_code: 0,
    status_msg: 'Settings updated',
  })
  res.pushBroadcastMessage({
    channel: 'site-settings-put',
    data: {
      data: siteSettings
    },
  })
}
