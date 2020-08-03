const dateTime = require('node-datetime')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const SITE_CONFIG = require('../../config/site-config')

const session = require('../../lib/session')
const permission = require('../../lib/permission')
const sessionQuery = require('../../module/session/query')

// const query = require('./query')
const logQuery = require('../log/query')


exports.getDashboard = async (req, res) => {
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
  let userID = req.session.user.user_id
  let sort = {
    log_date: -1
  }
  let skipItems = 0
  let limitItems = 3
  let mediaItems = await logQuery.getItems({
    match: {
      log_model: 'media',
      log_user_ref: userID,
    },
    sort: sort,
    skip: skipItems,
    limit: limitItems,
  })
  let pageItems = await logQuery.getItems({
    match: {
      log_model: 'page',
      log_user_ref: userID,
    },
    sort: sort,
    skip: skipItems,
    limit: limitItems,
  })
  let postItems = await logQuery.getItems({
    match: {
      log_model: 'post',
      log_user_ref: userID,
    },
    sort: sort,
    skip: skipItems,
    limit: limitItems,
  })
  let userItems = await logQuery.getItems({
    match: {
      log_model: 'user',
      log_user_ref: userID,
    },
    sort: sort,
    skip: skipItems,
    limit: limitItems,
  })
  let mediaTotalItems = await logQuery.getTotalItems({
    match: {
      log_model: 'media',
      log_user_ref: userID,
    },
  })
  let pageTotalItems = await logQuery.getTotalItems({
    match: {
      log_model: 'page',
      log_user_ref: userID,
    },
  })
  let postTotalItems = await logQuery.getTotalItems({
    match: {
      log_model: 'post',
      log_user_ref: userID,
    },
  })
  let userTotalItems = await logQuery.getTotalItems({
    match: {
      log_model: 'user',
      log_user_ref: userID,
    },
  })
  if (mediaItems.error || pageItems.error || postItems.error || userItems.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the dashboad',
    })
    return
  }
  res.send({
    items: [{
        model: 'media',
        items: mediaItems,
        total: mediaTotalItems,
      },
      {
        model: 'page',
        items: pageItems,
        total: pageTotalItems,
      },
      {
        model: 'post',
        items: postItems,
        total: postTotalItems,
      },
      {
        model: 'user',
        items: userItems,
        total: userTotalItems,
      },
    ],
  })
}
