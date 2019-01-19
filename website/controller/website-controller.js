const path = require('path')
const dateTime = require('node-datetime')

const APP_GLOBAL = require('../../config/global')
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const SITE_CONFIG = require('../../config/site-config')
const session = require('../../lib/session')
const routerException = require('../../lib/router-exception')

const modelPost = require(path.join('../model/post'))
const modelPage = require(path.join('../model/page'))
const modelMedia = require(path.join('../model/media'))
const modelUser = require(path.join('../model/user'))
const modelSetting = require(path.join('../model/setting'))
const modelSite = require(path.join('../model/site'))


exports.websiteSetupView = async (req, res) => {
    let totalUsers = await modelUser.countDocuments()
    if(totalUsers)
        return res.redirect('admin')

    res.view('setup', {
        title: 'SETUP',
        error_message: '',
    })
}

exports.websiteSetupSetInitialConfig = async (req, res) => {
    let totalUsers = await modelUser.countDocuments()
    if(totalUsers)
        return res.redirect('admin')

    let setup_site_name = req.body.setup_site_name
    let setup_site_url = req.body.setup_site_url
    let setup_first_name = req.body.setup_first_name
    let setup_user_email = req.body.setup_user_email
    let setup_user_name = req.body.setup_user_name
    let setup_user_pass = req.body.setup_user_pass
    if(!setup_site_name && !setup_site_url && !setup_first_name && !setup_user_name && !setup_user_pass) {
        res.view('setup', {
            title: 'SETUP',
            error_message: 'Complete the request data',
        })
    } else {
        let user = new modelUser()
        let settings = new modelSetting()
        let site = new modelSite()
        try {
            let userPassword = await session.hashPassword(setup_user_pass)
            user.user_name = setup_user_name
            user.user_pass = userPassword
            user.user_email = setup_user_email
            user.user_first_name = setup_first_name
            user.user_type = 'admin'
            user.user_registration_date = dateTime.create().format('Y-m-d H:M:S')
            user.user_active = true
            settings.setting_page_title = setup_site_name
            settings.setting_items_peer_page = 20
            site.site_name = setup_site_name
            site.site_items_peer_page = 12
            site.site_url = setup_site_url
            let userSaved = await user.save()
            let settingSaved = await settings.save()
            let siteSaved = await site.save()
            res.redirect('admin')
        } catch(err) {
            res.view('setup', {
                title: 'SETUP',
                error_message: err.toString(),
            })
        }
    }
}

exports.websiteAdminValidateRequestAccess = async (req, res) => {
    let totalUsers = await modelUser.countDocuments()
    if(!totalUsers)
        return res.redirect('setup')

    if(req.session.user && req.session.user.user_type === 'admin')
        res.redirect('dashboard')
    else
        res.view('dashboard-website-login', {
            title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
            error_message: '',
        })
}

exports.websiteAdminValidateLoginAccess = async (req, res) => {
    let totalUsers = await modelUser.countDocuments()
    if(!totalUsers)
        return res.redirect('setup')

    const user_name = req.body.user_name
    const user_pass = req.body.user_pass
    try {
        let user = await modelUser.findOne({
            'user_name': user_name,
        })
        if(!user) {
            res.view('dashboard-website-login', {
                title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
                error_message: 'Not valid user',
            })
            return
        }
        let result = await session.passwordIsEqual(user_pass, user.user_pass)
        if(!result)
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
        if(user.user_type === 'admin')
            return res.redirect('dashboard')
        throw new Error('Not valid user')
    } catch(err) {
        res.view('dashboard-website-login', {
            title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
            error_message: err,
        })
    }
}

exports.websiteAdminLogout = async (req, res) => {
    if(req.session.user) {
        let userID = req.session.user.user_id
        req.session = {}
        // TODO: finish session stored
        // session.removeUserSessionOnDB(userID)
        res.redirect('admin')
    }
    else
        res.redirect('admin')
}

exports.websiteDashboardView = async (req, res) => {
    res.view('dashboard-website-index', {
        title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
        user_id: req.session.user.user_id,
    })
}

exports.websiteIndexView = async (req, res) => {
    res.view('default/index', {
        title: SITE_CONFIG.siteTitle,
    })
}

exports.websitePageView = async (req, res) => {
    try {
        let pageSlug = req.params.slug
        let page = await modelPage.findOne({
            'page_slug': pageSlug,
        })
        if(!page) {
            res.code(404).view('404', {
                title: SITE_CONFIG.siteTitle,
                status: 'Page not found',
                error_message: 'Route: '+req.url+' Not found.',
            })
            return
        }
        res.view('default/page-detail', {
            title: SITE_CONFIG.siteTitle,
            page: page,
        })
    } catch(err) {
        res.code(500).view('500', {
            title: SITE_CONFIG.siteTitle,
            status: 'Server error!',
            error_message: 'Route: '+req.url+' Not found.',
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
            modelPost.countDocuments(),
            modelPost.find().skip(skipPosts).limit(SITE_CONFIG.siteItemsPeerPage).exec()
        ])
        if(!items.length) {
            res.code(404).view('404', {
                title: SITE_CONFIG.siteTitle,
                status: 'Page not found',
                error_message: 'Route: '+req.url+' Not found.',
            })
            return
        }
        res.view('default/post-list', {
            title: SITE_CONFIG.siteTitle,
            items: items,
            total_pages: Math.ceil(totalItems/SITE_CONFIG.siteItemsPeerPage),
            items_skipped: skipPosts,
            total_items: totalItems,
            current_page: currentPage,
            items_peer_page: SITE_CONFIG.siteItemsPeerPage,
            pagination_items: 2,
        })
    } catch(err) {
        res.code(500).view('500', {
            title: SITE_CONFIG.siteTitle,
            status: 'Server error!',
            error_message: 'Route: '+req.url+' Not found.',
        })
    }
}

exports.websiteBlogSingleView = async (req, res) => {
    let postSlug = req.params.slug
    try {
        let post = await modelPost.findOne({'post_slug': postSlug})
        if(!post) {
            res.code(404).view('404', {
                title: SITE_CONFIG.siteTitle,
                status: 'Error 404',
                error_message: 'Page not found',
            })
            return
        }
        res.view('default/post-detail', {
            title: SITE_CONFIG.siteTitle,
            post: post,
        })
    } catch(err) {
        res.code(500).view('500', {
            title: SITE_CONFIG.siteTitle,
            status: 'Server error!',
            error_message: 'Route: '+req.url+' Not found.',
        })
    }
}
