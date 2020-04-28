const dateTime = require('node-datetime')
const slugify = require('slugify')
const mongoose = require('mongoose')
const fs = require('fs')

const DASHBOARD_ADMIN_CONFIG = require('../config/dashboard-admin-config')
const SITE_CONFIG = require('../config/site-config')
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
const mediaQuery = require('../query/media-query')
const searchQuery = require('../query/search-query')
const dashboardQuery = require('../query/dashboard-query')
const userQuery = require('../query/user-query')
const settingQuery = require('../query/setting-query')
const siteQuery = require('../query/site-query')
const viewQuery = require('../query/view-query')
const resourceQuery = require('../query/resource-query')
const roleQuery = require('../query/role-query')
const logQuery = require('../query/log-query')


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
  let totalItems = await userQuery.getTotalItems()
  let items = await userQuery.getItemsByPage({
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
  let newUser = await userQuery.create(userData)
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
  let userToDelete = await userQuery.getByID(req.params.id)
  if (userToDelete.user_role.role_user_ref.toString() === '000000000000000000000000') {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let userDeleted = await userQuery.deleteByID(req.params.id)
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

exports.getMediaByID = async (req, res) => {
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
  let mediaItem = await mediaQuery.getByID(req.params.id)
  if (mediaItem.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Media not found',
    })
    return
  }
  res.send({
    data: mediaItem,
    status_code: 0,
    status_msg: '',
  })
}

exports.addNewMedia = async (req, res) => {
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
  let resultUpload = await mediaUpload(req, res)
  if (!resultUpload.fileData) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at upload media',
    })
    return
  }
  let newMedia = await mediaQuery.createNewMedia({
    media_original_name: resultUpload.fileData.originalName,
    media_name: resultUpload.fileData.fileName,
    media_title: resultUpload.postData.media_title,
    media_mime_type: resultUpload.fileData.mimeType,
    media_size: resultUpload.fileData.size,
    media_path: resultUpload.fileData.path,
    media_date: dateTime.create().format('Y-m-d H:M:S'),
    media_user_ref: req.session.user.user_id,
  })
  if (newMedia.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: newMedia.error.toString(),
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'New media created',
    data: {
      id: newMedia.id
    },
  })
  res.pushBroadcastMessage({
    channel: 'media-post',
    data: {
      data: newMedia
    },
  })
}

exports.getMediaByPage = async (req, res) => {
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
  let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let totalItems = await mediaQuery.getTotalItems()
  let items = await mediaQuery.getMediaItemsByPage({
    skip: skipPosts,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    sort: {
      'media_date': 'desc'
    },
  })
  if (items.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the media items',
    })
    return
  }
  res.send({
    items: items,
    total_pages: Math.ceil(totalItems / DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
    items_skipped: skipPosts,
    total_items: totalItems,
    status_code: 0,
    status_msg: '',
  })
}

exports.updateMediaByID = async (req, res) => {
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
  let media = await mediaQuery.updateByID({
    id: req.params.id,
    update_fields: {
      media_title: req.body.media_title,
    },
  })
  if (media.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Media was not updated',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'Media updated',
  })
  res.pushBroadcastMessage({
    channel: 'media-put',
    data: {
      data: media
    },
  })
}

exports.deleteMediaByID = async (req, res) => {
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
  let media = await mediaQuery.deleteByID(req.params.id)
  if (media.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at delete media',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'Media deleted',
  })
  res.pushBroadcastMessage({
    channel: 'media-delete',
    data: {
      data: media
    },
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
const directory = require('../lib/directory')
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
  let siteSettings = await siteQuery.getAll()
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
  let siteSettings = await siteQuery.update({
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

exports.getRolesByPage = async (req, res) => {
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
  let ascSort = -1
  let totalItems = await roleQuery.getTotalItems()
  if (totalItems.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the roles',
    })
    return
  }
  let items = await roleQuery.getItemsByPage({
    sort: ascSort,
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
  })
  if (items.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the roles',
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

exports.getRoleByID = async (req, res) => {
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
  let role = await roleQuery.getByID(req.params.id)
  if (role.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Role not found',
    })
    return
  }
  res.send({
    data: role,
    status_code: 0,
    status_msg: '',
  })
}

exports.updateRoleByID = async (req, res) => {
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
  let roleID = req.params.id
  let roleResources = req.body.role_resources
  let role = await roleQuery.updateByID({
    id: roleID,
    update_fields: {
      role_name: req.body.role_name
    },
  })
  if (role.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
    return
  }
  let resourcesToUpate = []
  let resourcesToSave = []
  let resourceToRemove = []
  for (let resource of roleResources) {
    if (resource.removed)
      resourceToRemove.push(resource)
    else if (resource._id)
      resourcesToUpate.push(resource)
    else
      resourcesToSave.push(resource)
  }
  if (resourcesToSave)
    for (let res of resourcesToSave) {
      let resourceData = {
        resource_name: res.resource_name,
        resource_role_ref: role._id,
        resource_permission: res.resource_permission,
      }
      await resourceQuery.create(resourceData)
    }
  if (resourcesToUpate)
    for (let res of resourcesToUpate) {
      let resourceData = {
        id: res._id,
        update_fields: {
          resource_name: res.resource_name,
          resource_permission: res.resource_permission,
        },
      }
      await resourceQuery.updateByID(resourceData)
    }
  if (resourceToRemove)
    for (let res of resourceToRemove)
      await resourceQuery.deleteByID(res._id)
  let roleUpdated = await roleQuery.getByID(roleID)
  let sessions = await sessionQuery.getSessionsWithRole(roleID)
  if (sessions) {
    // NOTE: update sessions with the same roleID
    let sessionIDs = []
    for (let session of sessions)
      sessionIDs.push(session._id)
    sessionQuery.findByIDAndUpdateResources(sessionIDs, roleUpdated.role_resources)
  }
  res.send({
    status_code: 0,
    status_msg: 'Role updated',
  })
  res.pushBroadcastMessage({
    channel: 'role-put',
    data: {
      data: roleUpdated,
    },
  })
}

exports.addNewRole = async (req, res) => {
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
  let role = await roleQuery.create({
    role_name: req.body.role_name,
    role_user_ref: req.session.user.user_id,
  })
  if (role.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Role not registered',
    })
    return
  }
  for (let resource of req.body.role_resources) {
    let resourceData = {
      resource_name: resource.resource_name,
      resource_role_ref: role._id,
      resource_permission: resource.resource_permission,
    }
    await resourceQuery.create(resourceData)
  }
  let objectId = mongoose.Types.ObjectId(role._id)
  let roleCreated = await roleQuery.getByID(role._id)
  res.send({
    data: roleCreated,
    status_code: 0,
    status_msg: 'New role registered',
  })
  res.pushBroadcastMessage({
    channel: 'role-post',
    data: {
      data: roleCreated
    },
  })
}

exports.deleteRoleByID = async (req, res) => {
  let hasPermission = permission.canUser({
    permission: 'd',
    req: req,
    res: res,
  })
  let id = req.params.id
  let roleToDelete = await roleQuery.getByID(id)
  if (!hasPermission || roleToDelete.role_user_ref.toString() === '000000000000000000000000') {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  await resourceQuery.deleteByRoleRef(id)
  let role = await roleQuery.deleteByID(id)
  if (role.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at delete role',
    })
  }
  res.send({
    status_code: 0,
    status_msg: 'Role deleted',
  })
  res.pushBroadcastMessage({
    channel: 'role-delete',
    data: {
      data: role,
    },
  })
}

exports.getViewNames = async (req, res) => {
  let views = await viewQuery.getAll()
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
  let view = await viewQuery.getByID(req.params.id)
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
  let view = await viewQuery.create(req.body)
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
  let totalItems = await viewQuery.getTotalItems()
  let ascSort = -1
  let items = await viewQuery.getItemsByPage({
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
  let view = await viewQuery.updateByID(objectData)
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
  let view = await viewQuery.deleteByID(req.params.id)
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
