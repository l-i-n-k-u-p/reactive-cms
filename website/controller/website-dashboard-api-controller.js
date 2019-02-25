const path = require('path')
const dateTime = require('node-datetime')
const slugify = require('slugify')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const SITE_CONFIG = require('../../config/site-config')
const websiteTemplates = require('../../config/website-templates')
const userTypes = require('../../config/user-types')
const { validateUserType } = require('../../lib/validate')
const { mediaUpload } = require('../../lib/media-upload')
const session = require('../../lib/session')
const {
  generatePostSlug,
  generatePageSlug,
} = require('../lib/lib')

const ModelUser = require(path.join('../model/user'))
const ModelPost = require(path.join('../model/post'))
const ModelPage = require(path.join('../model/page'))
const ModelMedia = require(path.join('../model/media'))
const ModelSetting = require(path.join('../model/setting'))
const ModelSite = require(path.join('../model/site'))


exports.login = async (req, res) => {
  const user_name = req.body.user_name
  const user_pass = req.body.user_pass
  try {
    let user = await ModelUser.findOne({
      'user_name': user_name,
    })
    if (!user)
      throw new Error('Not valid user')
    let result = await session.passwordIsEqual(user_pass, user.user_pass)
    if (!result)
      throw new Error('Not valid user')
    req.session.user = {
      user_id: user.id.toString(),
      user_name: user.user_name,
      user_email: user.user_email,
      user_pass: user.user_pass,
      user_type: user.user_type,
    }
    // TODO: finish session stored
    // session.saveSessionOnDB(req.cookies.sessionid, req.session.user)
    if (user.user_type === 'admin')
      res.send({
        user_id: user.id.toString(),
      })
    throw new Error('Not valid user')
  } catch (err) {
    res.send({
      error_message: err.toString(),
    })
  }
}

exports.search = async (req, res) => {
  try {
    const searchRegex = new RegExp(req.query.search, 'i')
    let data = await Promise.all([
      ModelUser.find({ 'user_name': searchRegex }).select(['user_name']).exec(),
      ModelPost.find({ 'post_title': searchRegex }).select(['post_title']).exec(),
      ModelPage.find({ 'page_title': searchRegex }).select(['page_title']).exec(),
      ModelMedia.find({ 'media_title': searchRegex }).select(['media_title']).exec(),
    ])
    res.send({
      items: data,
      status_code: 0,
      status_msg: '',
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error searching',
    })
  }
}

exports.searchMedia = async (req, res) => {
  try {
    const searchRegex = new RegExp(req.query.search, 'i')
    const mimetypeRegex = new RegExp(req.query.mimetype, 'i')
    let data = await ModelMedia.find({
      'media_title': searchRegex,
      'media_mime_type': mimetypeRegex
    }).exec()
    res.send({
      items: data,
      status_code: 0,
      status_msg: '',
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error searching',
    })
  }
}

exports.getUsersPaged = async (req, res) => {
  try {
    let skipUsers = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
    let [totalUsers, users] = await Promise.all([
      ModelUser.countDocuments(),
      ModelUser.find().select([
        'user_first_name',
        'user_last_name',
        'user_name',
        'user_email',
        'user_type',
        'user_registration_date',
        'user_active',
        'user_thumbnail',
        'user_avatar',
      ])
        .sort({ 'user_registration_date': 'desc' })
        .skip(skipUsers)
        .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST).exec(),
    ])
    res.send({
      items: users,
      total_pages: Math.ceil(totalUsers / DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
      items_skipped: skipUsers,
      total_items: totalUsers,
      status_code: 0,
      status_msg: '',
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error loading users',
    })
  }
}

exports.getUserByID = async (req, res) => {
  try {
    let user = await ModelUser.findById(req.params.id, [
      'user_first_name',
      'user_last_name',
      'user_name',
      'user_email',
      'user_type',
      'user_active',
      'user_registration_date',
      'user_thumbnail',
      'user_avatar',
    ])
    res.send(user)
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'User not found',
    })
  }
}

exports.addNewUser = async (req, res) => {
  try {
    let newUser = new ModelUser(req.body)
    newUser.user_registration_date = dateTime.create().format('Y-m-d H:M:S')
    let newPassword = await session.hashPassword(newUser.user_pass)
    newUser.user_pass = newPassword
    let user = await newUser.save()
    res.send({
      status_code: 0,
      status_msg: 'New user registered',
      data: {
        id: newUser.id
      }
    })
    req.pushBroadcastMessage({
      channel: 'user-post',
      data: { data: user },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: err.toString(),
    })
  }
}

exports.updateUserByID = async (req, res) => {
  // NOTE: improve this
  if (req.body.user_pass === undefined) {
    try {
      delete req.body.user_pass
      let isUserTypeValid = validateUserType(req.body.user_type)
      if (!isUserTypeValid)
        delete req.body.user_type
      let user = await ModelUser.findOneAndUpdate({ '_id': req.params.id }, req.body, { new: true })
      let sessionFinished = await session.currentUserSessionDataChanged(user, req)
      let message = 'User updated'
      if (sessionFinished)
        message = 'User updated and session finished'
      res.send({
        status_code: 0,
        status_msg: message,
      })
      user.user_pass = ''
      req.pushBroadcastMessage({
        channel: 'user-put',
        data: { data: user },
      })
    } catch (err) {
      res.send({
        status_code: 1,
        status_msg: 'It could not update the user' + err.toString(),
      })
    }
  } else {
    try {
      let isUserTypeValid = validateUserType(req.body.user_type)
      if (!isUserTypeValid)
        delete req.body.user_type
      let newPassword = await session.hashPassword(req.body.user_pass)
      req.body.user_pass = newPassword
      let user = await ModelUser.findOneAndUpdate({ '_id': req.params.id }, req.body, { new: true })
      let sessionFinished = await session.currentUserSessionDataChanged(user, req)
      session.removeUserSessionOnDB(user._id)
      let message = 'User updated'
      if (sessionFinished)
        message = 'User updated and session finished'
      res.send({
        status_code: 0,
        status_msg: message,
      })
      user.user_pass = ''
      req.pushBroadcastMessage({
        channel: 'user-put',
        data: { data: user },
      })
    } catch (err) {
      res.send({
        status_code: 1,
        status_msg: 'It could not update the user' + err.toString(),
      })
    }
  }
}

exports.deleteUserByID = async (req, res) => {
  try {
    let user = await ModelUser.findByIdAndRemove(req.params.id)
    session.removeUserSessionOnDB(user._id)
    res.send({
      status_code: 0,
      status_msg: 'User deleted',
    })
    req.pushBroadcastMessage({
      channel: 'user-delete',
      data: { data: user },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error at delete user',
    })
  }
}

exports.getPostByID = async (req, res) => {
  try {
    let post = await ModelPost.findById(req.params.id)
    res.send(post)
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Post not found',
    })
  }
}

exports.addNewPost = async (req, res) => {
  try {
    let newPost = new ModelPost(req.body)
    let newPostSlug = slugify(req.body.post_title, { lower: true })
    let slug = await generatePostSlug(null, newPostSlug)
    newPost.post_date = dateTime.create().format('Y-m-d H:M:S')
    newPost.post_slug = slug
    let post = await newPost.save()
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
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error at create post',
    })
  }
}

exports.getPostsByPage = async (req, res) => {
  try {
    let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
    let [totalItems, items] = await Promise.all([
      ModelPost.countDocuments(),
      ModelPost.find()
        .skip(skipPosts)
        .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST)
        .sort({ 'post_date': 'desc' })
        .exec()
    ])
    res.send({
      items: items,
      total_pages: Math.ceil(totalItems / DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
      items_skipped: skipPosts,
      total_items: totalItems,
      status_code: 0,
      status_msg: '',
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error loading the posts',
    })
  }
}

exports.updatePostByID = async (req, res) => {
  try {
    let post = await ModelPost.findById(req.params.id)
    let postSaved = null
    post.post_content = req.body.post_content
    post.post_status = req.body.post_status
    post.post_thumbnail = req.body.post_thumbnail
    if (post.post_title === req.body.post_title) {
      post.post_title = req.body.post_title
      postSaved = await post.save()
      res.send({
        status_code: 0,
        status_msg: 'Post updated',
      })
    } else {
      let newPostSlug = slugify(req.body.post_title, { lower: true })
      let slug = await generatePostSlug(post._id, newPostSlug)
      post.post_title = req.body.post_title
      post.post_slug = slug
      postSaved = await post.save()
      res.send({
        status_code: 0,
        status_msg: 'Post updated',
      })
    }
    req.pushBroadcastMessage({
      channel: 'post-put',
      data: { data: postSaved },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
  }
}

exports.deletePostByID = async (req, res) => {
  try {
    let post = await ModelPost.findByIdAndRemove(req.params.id)
    res.send({
      status_code: 0,
      status_msg: 'Post deleted',
    })
    req.pushBroadcastMessage({
      channel: 'post-delete',
      data: { data: post },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error at delete post',
    })
  }
}

exports.getPageByID = async (req, res) => {
  try {
    let page = await ModelPage.findById(req.params.id)
    res.send(page)
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Page not found',
    })
  }
}

exports.addNewPage = async (req, res) => {
  try {
    let newPost = new ModelPage(req.body)
    let newPostSlug = slugify(req.body.page_title, { lower: true })
    let slug = await generatePageSlug(null, newPostSlug)
    newPost.page_date = dateTime.create().format('Y-m-d H:M:S')
    newPost.page_slug = slug
    let page = await newPost.save()
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
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error at create page',
    })
  }
}

exports.getPagesByPage = async (req, res) => {
  try {
    let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
    let [totalItems, items] = await Promise.all([
      ModelPage.countDocuments(),
      ModelPage.find()
        .skip(skipPosts)
        .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST)
        .sort({ 'page_date': 'desc' })
        .exec()
    ])
    res.send({
      items: items,
      total_pages: Math.ceil(totalItems / DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
      items_skipped: skipPosts,
      total_items: totalItems,
      status_code: 0,
      status_msg: '',
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error loading the pages',
    })
  }
}

exports.updatePageByID = async (req, res) => {
  try {
    let page = await ModelPage.findById(req.params.id)
    let pageSaved = null
    page.page_content = req.body.page_content
    page.page_status = req.body.page_status
    page.page_thumbnail = req.body.page_thumbnail
    page.page_template = req.body.page_template
    page.page_gallery = req.body.page_gallery
    if (page.page_title === req.body.page_title) {
      page.page_title = req.body.page_title
      pageSaved = await page.save()
      res.send({
        status_code: 0,
        status_msg: 'Post updated',
      })
    } else {
      let newPostSlug = slugify(req.body.page_title, { lower: true })
      let slug = await generatePageSlug(page._id, newPostSlug)
      page.page_title = req.body.page_title
      page.page_slug = slug
      pageSaved = await page.save()
      res.send({
        status_code: 0,
        status_msg: 'Post updated',
      })
    }
    req.pushBroadcastMessage({
      channel: 'page-put',
      data: { data: pageSaved },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
  }
}

exports.deletePageByID = async (req, res) => {
  try {
    let page = await ModelPage.findByIdAndRemove(req.params.id)
    res.send({
      status_code: 0,
      status_msg: 'Post deleted',
    })
    req.pushBroadcastMessage({
      channel: 'page-delete',
      data: { data: page },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error at delete page',
    })
  }
}

exports.getMediaByID = async (req, res) => {
  try {
    let media = await ModelMedia.findById(req.params.id)
    if (!media)
      throw new Error('Media not found')
    res.send(media)
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Media not found',
    })
  }
}

exports.addNewMedia = async (req, res) => {
  try {
    let resultUpload = await mediaUpload(req, res)
    if (!resultUpload.fileData)
      throw new Error('Error at upload file')
    let newMedia = new ModelMedia({
      media_original_name: resultUpload.fileData.originalName,
      media_name: resultUpload.fileData.fileName,
      media_title: resultUpload.postData.media_title,
      media_mime_type: resultUpload.fileData.mimeType,
      media_size: resultUpload.fileData.size,
      media_path: resultUpload.fileData.path,
      media_date: dateTime.create().format('Y-m-d H:M:S'),
    })
    let media = await newMedia.save()
    res.send({
      status_code: 0,
      status_msg: 'New media added',
      data: {
        id: media.id
      },
    })
    req.pushBroadcastMessage({
      channel: 'media-post',
      data: { data: media },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error at upload media',
    })
  }
}

exports.getMediaByPage = async (req, res) => {
  try {
    let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
    let totalItems = await ModelMedia.countDocuments()
    let items = await ModelMedia.find()
      .skip(skipPosts)
      .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST)
      .sort({'media_date': 'desc'})
      .exec()
    res.send({
      items: items,
      total_pages: Math.ceil(totalItems / DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
      items_skipped: skipPosts,
      total_items: totalItems,
      status_code: 0,
      status_msg: '',
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error loading the media',
    })
  }
}

exports.updateMediaByID = async (req, res) => {
  try {
    let media = await ModelMedia.findById(req.params.id)
    let resMedia = null
    media.media_content = req.body.media_content
    media.media_status = req.body.media_status
    if (media.media_title === req.body.media_title) {
      media.media_title = req.body.media_title
      resMedia = await media.save()
      res.send({
        status_code: 0,
        status_msg: 'Post updated',
      })
    } else {
      let newMediaSlug = slugify(req.body.media_title, { lower: true })
      let slug = await generatePageSlug(media._id, newMediaSlug)
      media.media_title = req.body.media_title
      media.media_slug = slug
      resMedia = await media.save()
      res.send({
        status_code: 0,
        status_msg: 'Post updated',
      })
    }
    req.pushBroadcastMessage({
      channel: 'media-put',
      data: { data: resMedia },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
  }
}

exports.deleteMediaByID = async (req, res) => {
  try {
    let media = await ModelMedia.findByIdAndRemove(req.params.id)
    res.send({
      status_code: 0,
      status_msg: 'Media deleted',
    })
    req.pushBroadcastMessage({
      channel: 'media-delete',
      data: { data: media },
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error at delete media',
    })
  }
}

exports.getSettings = async (req, res) => {
  try {
    let settings = await ModelSetting.findOne()
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
      let settings = await ModelSetting.findOneAndUpdate({ '_id': req.body.id }, req.body, { new: true })
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
    let siteSettings = await ModelSite.findOne()
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
      let siteSettings = await ModelSite.findOneAndUpdate({ '_id': req.body.id }, req.body, { new: true })
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
  try {
    let data = await Promise.all([
      ModelUser.countDocuments(),
      ModelPost.countDocuments(),
      ModelPage.countDocuments(),
      ModelMedia.countDocuments(),
      ModelUser.find()
        .select([
          'user_first_name',
          'user_last_name',
          'user_name',
          'user_email',
          'user_type',
          'user_active',
          'user_registration_date',
          'user_thumbnail',
          'user_avatar',
        ]).sort({ 'user_registration_date': 'desc' }).limit(3),
      ModelPost.find().sort({'post_date': 'desc'}).limit(3),
      ModelPage.find().sort({'page_date': 'desc'}).limit(3),
      ModelMedia.find().sort({'media_date': 'desc'}).limit(3),
    ])
    res.send({
      items: [
        {
          model: 'user',
          total: data[0],
          last: data[4],
        },
        {
          model: 'post',
          total: data[1],
          last: data[5],
        },
        {
          model: 'page',
          total: data[2],
          last: data[6],
        },
        {
          model: 'media',
          total: data[3],
          last: data[7],
        },
      ],
      status_code: 0,
      status_msg: '',
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error loading Dashboard Info',
    })
  }
}

exports.getSettingAllPages = async (req, res) => {
  try {
    let items = await ModelPage.find()
      .sort({ 'page_date': 'desc' })
      .select([
        'page_status',
        'page_title',
      ])
      .exec()
    res.send({
      items: items,
    })
  } catch (err) {
    res.send({
      status_code: 1,
      status_msg: 'Error loading the pages',
    })
  }
}

exports.getUserTypes = async (req, res) => {
  res.send({
    items: userTypes,
  })
}

exports.getTemplateFileNames = async (req, res) => {
  res.send({
    items: websiteTemplates.templates,
  })
}
