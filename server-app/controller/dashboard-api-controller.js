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

const sessionQuery = require('../module/session/query')
const settingQuery = require('../module/setting/query')
const resourceQuery = require('../module/resource/query')
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
