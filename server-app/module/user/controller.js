const dateTime = require('node-datetime')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const session = require('../../lib/session')
const permission = require('../../lib/permission')
const sessionQuery = require('../../module/session/query')

const query = require('./query')


exports.getUsersPaged = async (req, res) => {
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
  let ascSort = -1
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let totalItems = await query.getTotalItems()
  let items = await query.getItemsByPage({
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    sort: {
      user_registration_date: ascSort
    },
  })
  if (items.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading users',
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

exports.getUserByID = async (req, res) => {
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
  let user = await query.getByID(req.params.id)
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

exports.addNewUser = async (req, res) => {
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
  let userData = req.body
  userData.user_registration_date = dateTime.create().format('Y-m-d H:M:S')
  userData.user_pass = await session.hashPassword(userData.user_pass)
  userData.user_user_ref = req.session.user.user_id
  let newUser = await query.create(userData)
  if (newUser.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error creating the user',
    })
    return
  }
  res.send({
    status_msg: 'New user registered',
    data: {
      id: newUser.id
    }
  })
  res.pushBroadcastMessage({
    channel: 'user-post',
    data: {
      data: newUser
    },
  })
}

exports.updateUserByID = async (req, res) => {
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
  if (req.body.user_pass === undefined || !req.body.user_pass.length)
    delete req.body.user_pass
  else {
    let newPassword = await session.hashPassword(req.body.user_pass)
    req.body.user_pass = newPassword
  }
  let userUpdated = await query.updateByID({
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
  let newUserData = await query.getByID(userUpdated._id)
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

exports.deleteUserByID = async (req, res) => {
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
  let userToDelete = await query.getByID(req.params.id)
  if (userToDelete.user_role.role_user_ref.toString() === '000000000000000000000000') {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let userDeleted = await query.deleteByID(req.params.id)
  if (userDeleted.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at delete user',
    })
    return
  }
  session.removeUserSessionOnDB(userDeleted._id)
  res.send({
    status_code: 0,
    status_msg: 'User deleted',
  })
  res.pushBroadcastMessage({
    channel: 'user-delete',
    data: {
      data: userDeleted
    },
  })
}
