const dateTime = require('node-datetime')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const session = require('../../lib/session')
const permission = require('../../lib/permission')
const sessionQuery = require('../../query/session-query')

const query = require('./query')


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
  let mediaItem = await query.getByID(req.params.id)
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
  let newMedia = await query.createNewMedia({
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
  let totalItems = await query.getTotalItems()
  let items = await query.getMediaItemsByPage({
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
  let media = await query.updateByID({
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
  let media = await query.deleteByID(req.params.id)
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
