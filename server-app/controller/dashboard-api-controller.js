const dateTime = require('node-datetime')
const slugify = require('slugify')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../config/dashboard-admin-config')
const SITE_CONFIG = require('../config/site-config')
const websiteTemplates = require('../config/website-templates')
const { mediaUpload } = require('../lib/media-upload')
const session = require('../lib/session')
const {
  generatePostSlug,
  generatePageSlug,
} = require('../lib/slug')

const SettingModel = require('../model/setting-model')
const SiteModel = require('../model/site-model')
const RoleModel = require('../model/role-model')
const ViewModel = require('../model/view-model')
const ResourceModel = require('../model/resource-model')

const sessionQuery = require('../query/session-query')
const mediaQuery = require('../query/media-query')
const searchQuery = require('../query/search-query')
const dashboardQuery = require('../query/dashboard-query')
const userQuery = require('../query/user-query')
const postQuery = require('../query/post-query')
const pageQuery = require('../query/page-query')


exports.login = async (req, res) => {
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
  let items = await searchQuery.getItemsWithWord(req.query.search)
  if (items.error) {
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
  let mediaData = await mediaQuery.searchMedia({
    search_word: req.query.search,
    search_mimetype: req.query.mimetype,
  })
  if (mediaData.error) {
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
  let ascSort = -1
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let totalItems = await userQuery.getTotalItems()
  let items = await userQuery.getItemsByPage({
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    sort: { user_registration_date: ascSort },
  })
  if (items.error) {
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
  let user = await userQuery.getByID(req.params.id)
  if (user.error) {
    res.send({
      status_code: 1,
      status_msg: err.toString(),
    })
    return
  }
  res.send(user)
}

exports.addNewUser = async (req, res) => {
  let userData = req.body
  userData.user_registration_date = dateTime.create().format('Y-m-d H:M:S')
  userData.user_pass = await session.hashPassword(userData.user_pass)
  let newUser = await userQuery.create(userData)
  if (newUser.error) {
    res.send({
      status_code: 1,
      status_msg: err.toString(),
    })
    return
  }
  res.send({
    status_msg: 'New user registered',
    data: {
      id: newUser.id
    }
  })
  req.pushBroadcastMessage({
    channel: 'user-post',
    data: { data: newUser },
  })
}

exports.updateUserByID = async (req, res) => {
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
  req.pushBroadcastMessage({
    channel: 'user-put',
    data: { data: newUserData },
  })
}

exports.deleteUserByID = async (req, res) => {
  let userDeleted = await userQuery.deleteByID(req.params.id)
  if (userDeleted.error) {
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
  req.pushBroadcastMessage({
    channel: 'user-delete',
    data: { data: userDeleted },
  })
}

exports.getPostByID = async (req, res) => {
  let post = await postQuery.getByID(req.params.id)
  if (post.error) {
    res.send({
      status_code: 1,
      status_msg: 'Post not found',
    })
    return
  }
  res.send(post)
}

exports.addNewPost = async (req, res) => {
  let bodyPostTitle = req.body.post_title
  if (!bodyPostTitle) {
    res.send({
      status_code: 1,
      status_msg: 'Error at create post',
    })
    return
  }
  let newPostSlug = slugify(bodyPostTitle, { lower: true })
  let slug = await generatePostSlug(null, newPostSlug)
  if (slug.error) {
    res.send({
      status_code: 1,
      status_msg: 'Error at create post',
    })
    return
  }
  req.body.post_date = dateTime.create().format('Y-m-d H:M:S')
  req.body.post_slug = slug
  let post = await postQuery.create(req.body)
  if (post.error) {
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
  req.pushBroadcastMessage({
    channel: 'post-post',
    data: { data: post },
  })
}

exports.getPostsByPage = async (req, res) => {
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let totalItems = await postQuery.getTotalItems()
  let ascSort = -1
  let items = await postQuery.getItemsByPage({
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    sort: { 'post_date': ascSort },
  })
  if (items.error) {
    console.log(items.error)
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

exports.updatePostByID = async (req, res) => {
  let newPostSlug = slugify(req.body.post_title, { lower: true })
  let slug = await generatePostSlug(req.params.id, newPostSlug)
  if (slug.error) {
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
  let post = await postQuery.updateByID(objectData)
  if (post.error) {
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
  req.pushBroadcastMessage({
    channel: 'post-put',
    data: { data: post },
  })
}

exports.deletePostByID = async (req, res) => {
  let post = await postQuery.deleteByID(req.params.id)
  if (post.error) {
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
  req.pushBroadcastMessage({
    channel: 'post-delete',
    data: { data: post },
  })
}

exports.getPageByID = async (req, res) => {
  let page = await pageQuery.getByID(req.params.id)
  if (page.error) {
    res.send({
      status_code: 1,
      status_msg: 'Page not found',
    })
    return
  }
  res.send(page)
}

exports.addNewPage = async (req, res) => {
  let newPostSlug = slugify(req.body.page_title, { lower: true })
  let slug = await generatePageSlug(null, newPostSlug)
  req.body.page_date = dateTime.create().format('Y-m-d H:M:S')
  req.body.page_slug = slug
  let page = await pageQuery.create(req.body)
  if (page.error) {
    res.send({
      status_code: 1,
      status_msg: 'Error at create page',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'New page registered',
    data: {
      id: page.id
    },
  })
  req.pushBroadcastMessage({
    channel: 'page-post',
    data: { data: page },
  })
}

exports.getPagesByPage = async (req, res) => {
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let totalItems = await pageQuery.getTotalItems()
  let ascSort = -1
  let items = await pageQuery.getItemsByPage({
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    sort: { 'page_date': ascSort },
  })
  if (items.error) {
    console.log(items.error)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the pages',
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

exports.updatePageByID = async (req, res) => {
  let userResources = req.session.user.user_resource
  let hasPermission = false
  let resourceName = res.context.config.resource_name
  for (let userResource of userResources) {
    if (userResource.resource_name === resourceName) {
      let resourcePermission = userResource.resource_permission.join(',')
      if (resourcePermission.includes('u'))
        hasPermission = true
    }
  }
  if (!hasPermission) {
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let newPostSlug = slugify(req.body.page_title, { lower: true })
  let slug = await generatePageSlug(req.params.id, newPostSlug)
  let page = await pageQuery.updateByID({
    id: req.params.id,
    update_fields: {
      page_title: req.body.page_title,
      page_content: req.body.page_content,
      page_status: req.body.page_status,
      page_thumbnail: req.body.page_thumbnail,
      page_template: req.body.page_template,
      page_gallery: req.body.page_gallery,
      page_slug: slug
    }
  })
  if (page.error) {
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'Page updated',
  })
  req.pushBroadcastMessage({
    channel: 'page-put',
    data: { data: page },
  })
}

exports.deletePageByID = async (req, res) => {
  let page = await pageQuery.deleteByID(req.params.id)
  if (page.error) {
    res.send({
      status_code: 1,
      status_msg: 'Error at delete page',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: 'Post deleted',
  })
  req.pushBroadcastMessage({
    channel: 'page-delete',
    data: { data: page },
  })
}

exports.getMediaByID = async (req, res) => {
  let mediaItem = await mediaQuery.getByID(req.params.id)
  if (mediaItem.error) {
    res.send({
      status_code: 1,
      status_msg: 'Media not found',
    })
    return
  }
  res.send(mediaItem)
}

exports.addNewMedia = async (req, res) => {
  let resultUpload = await mediaUpload(req, res)
  if (!resultUpload.fileData) {
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
  })
  if (newMedia.error) {
    res.send({
      status_code: 1,
      status_msg: 'Error seving media',
    })
    return
  }
  res.send({
    status_code: 0,
    status_msg: '',
    data: {
      id: newMedia.id
    },
  })
  req.pushBroadcastMessage({
    channel: 'media-post',
    data: { data: newMedia },
  })
}

exports.getMediaByPage = async (req, res) => {
  let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let totalItems = await mediaQuery.getTotalItems()
  let items = await mediaQuery.getMediaItemsByPage({
    skip: skipPosts,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
    sort: { 'media_date': 'desc' },
  })
  if (items.error) {
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
  let media = await mediaQuery.updateByID({
    id: req.params.id,
    update_fields: {
      media_title: req.body.media_title,
    },
  })
  if (media.error) {
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
  req.pushBroadcastMessage({
    channel: 'media-put',
    data: { data: media },
  })
}

exports.deleteMediaByID = async (req, res) => {
  let media = await mediaQuery.deleteByID(req.params.id)
  if (media.error) {
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
  req.pushBroadcastMessage({
    channel: 'media-delete',
    data: { data: media },
  })
}

exports.getSettings = async (req, res) => {
  try {
    let settings = await SettingModel.findOne()
    res.send(settings)
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Settings not found',
    })
  }
}

exports.updateSettings = async (req, res) => {
  if (req.body)
    try {
      let settings = await SettingModel.findOneAndUpdate({ '_id': req.body.id }, req.body, { new: true })
      DASHBOARD_ADMIN_CONFIG.loadDashboardSettings()
      res.send({
        status_code: 0,
        status_msg: 'Settings updated',
      })
      req.pushBroadcastMessage({
        channel: 'settings-put',
        data: { data: settings },
      })
    } catch (err) {
      res.send({
        status_code: 1,
        status_msg: 'It could not update the settings',
      })
    }
}

exports.getSiteSettings = async (req, res) => {
  try {
    let siteSettings = await SiteModel.findOne()
    res.send(siteSettings)
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Site settings not found',
    })
  }
}

exports.updateSiteSettings = async (req, res) => {
  if (req.body)
    try {
      let siteSettings = await SiteModel.findOneAndUpdate({ '_id': req.body.id }, req.body, { new: true })
      SITE_CONFIG.loadSiteSettings()
      res.send({
        status_code: 0,
        status_msg: 'Settings updated',
      })
      req.pushBroadcastMessage({
        channel: 'site-settings-put',
        data: { data: siteSettings },
      })
    } catch (err) {
      res.send({
        status_code: 1,
        status_msg: 'It could not update the site settings',
      })
    }
}

exports.getDashboard = async (req, res) => {
  let items = await dashboardQuery.getLog()
  if (items.error) {
    res.send({
      status_code: 1,
      status_msg: 'Error loading dashboard data',
    })
    return
  }
  res.send({
    items: [
      {
        model: 'user',
        total: items[0],
        last: items[4],
      },
      {
        model: 'post',
        total: items[1],
        last: items[5],
      },
      {
        model: 'page',
        total: items[2],
        last: items[6],
      },
      {
        model: 'media',
        total: items[3],
        last: items[7],
      },
    ],
  })
}

exports.getTemplateFileNames = async (req, res) => {
  res.send({
    items: websiteTemplates.templates,
  })
}

exports.getRolesByPage = async (req, res) => {
  try {
    let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
    let ascSort = -1
    let items = await RoleModel.aggregate([
      {
        $sort: {
          _id: ascSort,
        },
      },
      {
        $lookup: {
          from: 'resource',
          localField: '_id',
          foreignField: 'resource_role_ref',
          as: 'role_resources',
        }
      },
      {
        $skip: skipItems,
      },
      {
        $limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
      }
    ])
    let totalItems = items.length
    res.send({
      items: items,
      total_pages: Math.ceil(totalItems / DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
      items_skipped: skipItems,
      total_items: totalItems,
      status_code: 0,
      status_msg: '',
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error loading the roles',
    })
  }
}

exports.getRoleByID = async (req, res) => {
  let objectId = mongoose.Types.ObjectId(req.params.id)
  try {
    let item = await RoleModel.aggregate([
      {
        $match: {
          _id: objectId,
        },
      },
      {
        $lookup: {
          from: 'resource',
          localField: '_id',
          foreignField: 'resource_role_ref',
          as: 'role_resources',
        },
      },
      {
        $addFields: {
          id: req.params.id,
        },
      },
    ])
    if (!item.length)
      throw new Error('Role not found')

    res.send(item[0])
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Role not found',
    })
  }
}

exports.updateRoleByID = async (req, res) => {
  try {
    let roleID = req.params.id
    let roleResources = req.body.role_resources
    let role = await RoleModel.findById(roleID)
    role.role_name = req.body.role_name
    await role.save()
    let resourcesToUpate = []
    let resourcesToSave = []
    for (let resource of roleResources) {
      if (resource._id)
        resourcesToUpate.push(resource)
      else
        resourcesToSave.push(resource)
    }
    if (resourcesToSave) {
      let queries = []
      for (let res of resourcesToSave) {
        let newResource = new ResourceModel()
        newResource.resource_name = res.resource_name
        newResource.resource_role_ref = role._id
        newResource.resource_permission = res.resource_permission
        queries.push(newResource.save())
      }
      await Promise.all(queries)
    }
    if (resourcesToUpate) {
      let queries = []
      for (let res of resourcesToUpate) {
        let resource = ResourceModel.updateOne({
          _id: mongoose.Types.ObjectId(res._id),
        }, {
          $set: {
            resource_name: res.resource_name,
            resource_permission: res.resource_permission,
          },
        })
        queries.push(resource)
      }
      await Promise.all(queries)
    }
    let objectId = mongoose.Types.ObjectId(roleID)
    let roleUpdated = await RoleModel.aggregate([
      {
        $match: {
          _id: objectId,
        }
      },
      {
        $lookup: {
          from: 'resource',
          localField: '_id',
          foreignField: 'resource_role_ref',
          as: 'role_resources'
        },
      },
      {
        $addFields: {
          id: roleID,
        },
      },
    ])
    roleUpdated = roleUpdated[0]
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
    req.pushBroadcastMessage({
      channel: 'role-put',
      data: {
        data: roleUpdated,
      },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
  }
}

exports.addNewRole = async (req, res) => {
  try {
    let role = new RoleModel()
    role.role_name = req.body.role_name
    role.role_user_ref = req.session.user.user_id
    let newRole = await role.save()
    let queries = []
    let newResource = null
    for (let resource of req.body.role_resources) {
      newResource = new ResourceModel()
      newResource.resource_name = resource.resource_name
      newResource.resource_role_ref = newRole._id
      newResource.resource_permission = resource.resource_permission
      queries.push(newResource.save())
    }
    await Promise.all(queries)
    let objectId = mongoose.Types.ObjectId(newRole._id)
    let item = await RoleModel.aggregate([
      {
        $match: {
          _id: objectId,
        },
      },
      {
        $lookup: {
          from: 'resource',
          localField: '_id',
          foreignField: 'resource_role_ref',
          as: 'role_resources',
        },
      },
      {
        $addFields: {
          id: newRole._id,
        },
      },
    ])
    res.send({
      data: item[0],
      status_code: 0,
      status_msg: 'New role registered',
    })
    req.pushBroadcastMessage({
      channel: 'role-post',
      data: { data: item[0] },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Role not registered',
    })
  }
}

exports.deleteRoleByID = async (req, res) => {
  try {
    let id = req.params.id
    let objectId = mongoose.Types.ObjectId(id)
    await ResourceModel.find({
      resource_role_ref: objectId,
    }).remove()
    let role = await RoleModel.findByIdAndRemove(id)
    res.send({
      status_code: 0,
      status_msg: 'Role deleted',
    })
    req.pushBroadcastMessage({
      channel: 'role-delete',
      data: {
        data: role,
      },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error at delete role',
    })
  }
}

exports.getViewNames = async (req, res) => {
  try {
    let items = await ViewModel.find()
    res.send({
      items: items,
      status_code: 0,
      status_msg: '',
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Views not found',
    })
  }
}
