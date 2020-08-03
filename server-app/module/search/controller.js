const dateTime = require('node-datetime')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const session = require('../../lib/session')
const permission = require('../../lib/permission')
const sessionQuery = require('../../module/session/query')

const query = require('./query')


exports.search = async (req, res) => {
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
  let items = await query.getItemsWithWord(req.query.search)
  if (items.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error searching',
    })
    return
  }
  res.send({
    items: items,
  })
}

exports.searchMedia = async (req, res) => {
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
  let mediaData = await query.searchMedia({
    search_word: req.query.search,
    search_mimetype: req.query.mimetype,
  })
  if (mediaData.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error searching media',
    })
    return
  }
  res.send({
    items: mediaData,
  })
}
