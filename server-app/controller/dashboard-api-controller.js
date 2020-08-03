const dateTime = require('node-datetime')
const slugify = require('slugify')
const mongoose = require('mongoose')
const fs = require('fs')

const DASHBOARD_ADMIN_CONFIG = require('../config/dashboard-admin-config')
const {
  mediaUpload
} = require('../lib/media-upload')
const session = require('../lib/session')
const {
  generatePostSlug,
  generatePageSlug,
} = require('../lib/slug')
const permission = require('../lib/permission')

const sessionQuery = require('../query/session-query')
const mediaQuery = require('../module/media/query')
const searchQuery = require('../query/search-query')
const dashboardQuery = require('../query/dashboard-query')
const settingQuery = require('../query/setting-query')
const resourceQuery = require('../module/resource/query')
const logQuery = require('../query/log-query')
const userQuery = require('../module/user/query')


exports.login = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.send({
      error_message: fisrtMessage.message,
    })
    return
  }
  const userName = req.body.user_name
  const userPass = req.body.user_pass
  let user = await userQuery.getByUserName(userName)
  if (user.error) {
    res.send({
      error_message: user.error.toString(),
    })
    return
  }
  if (!user) {
    res.send({
      error_message: 'Not valid user',
    })
    return
  }
  let result = await session.passwordIsEqual(userPass, user.user_pass)
  if (!result) {
    res.send({
      error_message: 'Not valid user',
    })
    return
  }
  req.session.user = {
    user_id: user._id.toString(),
    user_name: user.user_name,
    user_email: user.user_email,
    user_pass: user.user_pass,
    user_role_ref: user.user_role_ref,
    user_role: user.user_role,
    user_resource: user.user_resource,
  }
  res.send({
    user_id: user._id.toString(),
  })
}

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
  let items = await searchQuery.getItemsWithWord(req.query.search)
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
  let mediaData = await mediaQuery.searchMedia({
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
  let settings = await settingQuery.getAll()
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

  let settings = await settingQuery.update({
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

exports.getProfileByID = async (req, res) => {
  let isSameSessionUserID = req.params.id === req.session.user.user_id
  if (!isSameSessionUserID) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let user = await userQuery.getByID(req.params.id)
  if (user.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: err.toString(),
    })
    return
  }
  res.send({
    data: user,
    status_code: 0,
    status_msg: '',
  })
}

exports.updateProfileByID = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return
  }
  let isSameSessionUserID = req.params.id === req.session.user.user_id
  if (!isSameSessionUserID) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  if (req.body.user_pass === undefined || !req.body.user_pass.length)
    delete req.body.user_pass
  else {
    let newPassword = await session.hashPassword(req.body.user_pass)
    req.body.user_pass = newPassword
  }
  delete req.body.user_name
  let userUpdated = await userQuery.updateByID({
    id: req.params.id,
    update_fields: req.body,
  })
  if (userUpdated.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'It could not update the user',
    })
    return
  }
  let sessionFinished = await session.currentUserSessionDataChanged(userUpdated, req)
  if (sessionFinished)
    session.removeUserSessionOnDB(userUpdated._id)
  let message = 'User updated'
  if (sessionFinished)
    message = 'User updated and session finished'
  let objectId = mongoose.Types.ObjectId(userUpdated._id)
  await sessionQuery.refreshUserSessionByID(objectId)
  let newUserData = await userQuery.getByID(userUpdated._id)
  res.send({
    status_code: 0,
    status_msg: message,
  })
  res.pushBroadcastMessage({
    channel: 'user-put',
    data: {
      data: newUserData
    },
  })
}

exports.getDashboardSettings = async (req, res) => {
  let settings = await settingQuery.getAll()
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
