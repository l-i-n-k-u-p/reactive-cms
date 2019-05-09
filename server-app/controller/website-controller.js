const dateTime = require('node-datetime')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../config/dashboard-admin-config')
const SITE_CONFIG = require('../config/site-config')
const VIEW_FUNCTIONS = require('../lib/view-functions')
const VIEWS = require('../config/views')
const session = require('../lib/session')

const PostModel = require('../model/post-model')
const PageModel = require('../model/page-model')
const UserModel = require('../model/user-model')
const SettingModel = require('../model/setting-model')
const SiteModel = require('../model/site-model')
const ViewModel = require('../model/view-model')
const RoleModel = require('../model/role-model')
const ResourceModel = require('../model/resource-model')


exports.websiteSetupView = async (req, res) => {
  let totalUsers = await UserModel.countDocuments()
  if (totalUsers) {
    DASHBOARD_ADMIN_CONFIG.setupPassed = true
    return res.redirect('/admin')
  }
  DASHBOARD_ADMIN_CONFIG.setupPassed = false
  res.view('setup', {
    viewFunctions: VIEW_FUNCTIONS,
    title: 'SETUP',
    error_message: '',
  })
}

exports.websiteSetupPassed = async (req, res, next) => {
  if (!DASHBOARD_ADMIN_CONFIG.setupPassed)
    return res.redirect('/setup')
}

exports.websiteSetupSetInitialConfig = async (req, res) => {
  let setup_site_name = req.body.setup_site_name
  let setup_site_url = req.body.setup_site_url
  let setup_first_name = req.body.setup_first_name
  let setup_user_email = req.body.setup_user_email
  let setup_user_name = req.body.setup_user_name
  let setup_user_pass = req.body.setup_user_pass
  if (!setup_site_name && !setup_site_url && !setup_first_name && !setup_user_name && !setup_user_pass) {
    res.view('setup', {
      title: 'SETUP',
      error_message: 'Complete the request data',
    })
  } else {
    let user = new UserModel()
    let settings = new SettingModel()
    let site = new SiteModel()
    try {
      let totalUsers = await UserModel.countDocuments()
      if (totalUsers)
        return res.redirect('admin')

      let viewsSaved = await ViewModel.insertMany(VIEWS)
      let adminRole = new RoleModel()
      adminRole.role_name = 'administrator'
      adminRole.role_user_ref = '000000000000000000000000'
      await adminRole.save()
      let resources = []
      for (let view of viewsSaved) {
        resources.push({
          resource_name: view.view_name,
          resource_permission: ['c', 'r', 'u', 'd', 'v'],
          resource_role_ref: adminRole._id,
        })
      }
      await ResourceModel.insertMany(resources)
      let userPassword = await session.hashPassword(setup_user_pass)
      user.user_name = setup_user_name
      user.user_pass = userPassword
      user.user_email = setup_user_email
      user.user_first_name = setup_first_name
      user.user_registration_date = dateTime.create().format('Y-m-d H:M:S')
      user.user_active = true
      user.user_role_ref = adminRole
      settings.setting_page_title = DASHBOARD_ADMIN_CONFIG.dashboardTitle
      settings.setting_items_peer_page = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST
      site.site_name = setup_site_name
      site.site_items_peer_page = SITE_CONFIG.siteItemsPeerPage
      site.site_url = setup_site_url
      await user.save()
      await settings.save()
      await site.save()
      DASHBOARD_ADMIN_CONFIG.setupPasse = true
      res.redirect('admin')
    } catch (err) {
      res.view('setup', {
        title: 'SETUP',
        error_message: err.toString(),
      })
    }
  }
}

exports.websiteAdminValidateRequestAccess = async (req, res) => {
  let totalUsers = await UserModel.countDocuments()
  if (!totalUsers)
    return res.redirect('setup')

  if (req.session.user && req.session.user.user_role)
    res.redirect('dashboard')
  else
    res.view('dashboard-website-login', {
      title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
      error_message: '',
    })
}

exports.websiteAdminValidateLoginAccess = async (req, res) => {
  let totalUsers = await UserModel.countDocuments()
  if (!totalUsers)
    return res.redirect('setup')

  const user_name = req.body.user_name
  const user_pass = req.body.user_pass
  try {
    let roles = await RoleModel.find()
    let user = await UserModel.aggregate([
      {
        $match: {
          user_name: user_name,
        },
      },
      {
        $lookup: {
          from: 'role',
          localField: 'user_role_ref',
          foreignField: '_id',
          as: 'user_role',
        },
      },
      {
        $unwind: '$user_role',
      },
      {
        $lookup: {
          from: 'resource',
          localField: 'user_role_ref',
          foreignField: 'resource_role_ref',
          as: 'user_resource',
        },
      },
    ])
    user = user[0]
    if (!user) {
      res.view('dashboard-website-login', {
        viewFunctions: VIEW_FUNCTIONS,
        title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
        error_message: 'Not valid user',
      })
      return
    }
    let result = await session.passwordIsEqual(user_pass, user.user_pass)
    if (!result)
      throw new Error('Not valid user')
    let roleExists = false
    for (let role of roles)
      if (role._id.toString() === user.user_role_ref.toString())
        roleExists = true
    if (!roleExists)
      throw new Error('Not valid user')
    req.session.user = {
      user_id: user._id.toString(),
      user_name: user.user_name,
      user_email: user.user_email,
      user_pass: user.user_pass,
      user_role: user.user_role,
      user_resource: user.user_resource,
      user_role_ref: user.user_role_ref,
    }
    res.redirect('dashboard')
  } catch (err) {
    res.view('dashboard-website-login', {
      title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
      error_message: err,
    })
  }
}

exports.websiteDashboardLogout = async (req, res) => {
  if (req.session && req.session.user) {
    let userID = req.session.user.user_id
    req.sessionStore.destroy(req.session.sessionId)
    await session.removeUserSessionOnDB(userID)
    req.session = null
  }
  res.redirect('admin')
}

exports.websiteDashboardView = async (req, res) => {
  let objectId = mongoose.Types.ObjectId(req.session.user.user_id)
  let user = await UserModel.aggregate([
    {
      $match: {
        _id: objectId,
      },
    },
    {
      $lookup: {
        from: 'role',
        localField: 'user_role_ref',
        foreignField: '_id',
        as: 'user_role',
      },
    },
    {
      $unwind: '$user_role',
    },
    {
      $lookup: {
        from: 'resource',
        localField: 'user_role_ref',
        foreignField: 'resource_role_ref',
        as: 'user_resource',
      },
    },
  ])
  user = user[0]
  res.view('dashboard-website-index', {
    viewFunctions: VIEW_FUNCTIONS,
    title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
    user_id: req.session.user.user_id,
    user_data: JSON.stringify(user),
  })
}

exports.websiteIndexView = async (req, res) => {
  try {
    let page = null
    let pageView = 'default/index'
    let templateHomeID = SITE_CONFIG.siteTemplateHome
    if (templateHomeID) {
      page = await PageModel.findById(templateHomeID)
      if (page.page_template)
        pageView = 'template/' + page.page_template
    }
    res.view(pageView, {
      viewFunctions: VIEW_FUNCTIONS,
      title: SITE_CONFIG.siteTitle,
      page: page,
    })
  } catch (err) {
    res.code(500).send({
      status_code: 1,
      status_msg: 'Page Not Found',
    })
  }
}

exports.websitePageView = async (req, res) => {
  try {
    let pageSlug = req.params.slug
    let pageView = 'default/page-detail'
    let page = await PageModel.findOne({
      'page_slug': pageSlug,
    })
    if (!page) {
      const urlData = req.urlData()
      res.code(404).view('404', {
        title: SITE_CONFIG.siteTitle,
        status: 'Page not found',
        error_message: 'Route: ' + urlData.path + ' Not found.',
      })
      return
    }
    if (page.page_template)
      pageView = 'template/' + page.page_template
    res.view(pageView, {
      viewFunctions: VIEW_FUNCTIONS,
      title: SITE_CONFIG.siteTitle,
      page: page,
    })
  } catch (err) {
    req.log.warn(err)
    let statusCode = err.statusCode >= 400 ? err.statusCode : 500
    res.code(statusCode).view('500', {
      title: SITE_CONFIG.siteTitle,
      status: 'Server error!',
      error_message: statusCode >= 500 ? 'Internal server error' : err.message,
    })
  }
}

exports.websiteBlogArchiveView = async (req, res) => {
  res.redirect('/blog/page/1')
}

exports.websiteBlogArchivePaginatedView = async (req, res) => {
  try {
    let currentPage = req.params.page
    let skipPosts = SITE_CONFIG.siteItemsPeerPage * (currentPage - 1)
    let [totalItems, items] = await Promise.all([
      PostModel.countDocuments(),
      PostModel.find().skip(skipPosts).limit(SITE_CONFIG.siteItemsPeerPage).exec()
    ])
    if (!items.length) {
      const urlData = req.urlData()
      res.code(404).view('404', {
        title: SITE_CONFIG.siteTitle,
        status: 'Page not found',
        error_message: 'Route: ' + urlData.path + ' Not found.',
      })
      return
    }
    let view = 'default/post-list'
    if (SITE_CONFIG.siteTemplatePosts)
      view = 'template/' + SITE_CONFIG.siteTemplatePosts
    res.view(view, {
      viewFunctions: VIEW_FUNCTIONS,
      title: SITE_CONFIG.siteTitle,
      items: items,
      total_pages: Math.ceil(totalItems / SITE_CONFIG.siteItemsPeerPage),
      items_skipped: skipPosts,
      total_items: totalItems,
      current_page: currentPage,
      items_peer_page: SITE_CONFIG.siteItemsPeerPage,
      pagination_items: 2,
    })
  } catch (err) {
    req.log.warn(err)
    let statusCode = err.statusCode >= 400 ? err.statusCode : 500
    res.code(statusCode).view('500', {
      title: SITE_CONFIG.siteTitle,
      status: 'Server error!',
      error_message: statusCode >= 500 ? 'Internal server error' : err.message,
    })
  }
}

exports.websiteBlogSingleView = async (req, res) => {
  let postSlug = req.params.slug
  try {
    let post = await PostModel.findOne({ 'post_slug': postSlug })
    if (!post) {
      const urlData = req.urlData()
      res.code(404).view('404', {
        title: SITE_CONFIG.siteTitle,
        status: 'Page not found',
        error_message: 'Route: ' + urlData.path + ' Not found.',
      })
      return
    }
    res.view('default/post-detail', {
      viewFunctions: VIEW_FUNCTIONS,
      title: SITE_CONFIG.siteTitle,
      post: post,
    })
  } catch (err) {
    req.log.warn(err)
    let statusCode = err.statusCode >= 400 ? err.statusCode : 500
    res.code(statusCode).view('500', {
      title: SITE_CONFIG.siteTitle,
      status: 'Server error!',
      error_message: statusCode >= 500 ? 'Internal server error' : err.message,
    })
  }
}
