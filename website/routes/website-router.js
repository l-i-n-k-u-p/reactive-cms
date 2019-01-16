const path = require('path')
const express = require('express')
const router = express.Router()
const dateTime = require('node-datetime')

const APP_GLOBAL = require('../../config/global.js')
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config.js')
const SITE_CONFIG = require('../../config/site-config')
const session = require('../../lib/session')
const routerException = require('../../lib/router-exception')

const modelPost = require(path.join(APP_GLOBAL.appServerPath, '../models/post'))
const modelPage = require(path.join(APP_GLOBAL.appServerPath, '../models/page'))
const modelMedia = require(path.join(APP_GLOBAL.appServerPath, '../models/media'))
const modelUser = require(path.join(APP_GLOBAL.appServerPath, '../models/user'))
const modelSetting = require(path.join(APP_GLOBAL.appServerPath, '../models/setting'))
const modelSite = require(path.join(APP_GLOBAL.appServerPath, '../models/site'))


// start - website setup page

// NOTE: force setup page
router.get('*', (req, res) => {
    if(DASHBOARD_ADMIN_CONFIG.setupPassed)
        return req.next()

    if(req.path.indexOf('setup') >= 0)
        return req.next()

    res.redirect('setup')
})

router.get('/setup', async (req, res) => {
    let totalUsers = await modelUser.countDocuments()
    if(totalUsers)
        return res.redirect('admin')

    res.render('setup', {
        title: 'SETUP',
        error_message: '',
    })
})

router.post('/setup', async (req, res) => {
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
        res.render('setup', {
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
            res.render('setup', {
                title: 'SETUP',
                error_message: err.toString(),
            })
        }
    }
})

// end - website setup page


// start - website admin page login/out

router.get('/admin', async (req, res) => {
    let totalUsers = await modelUser.countDocuments()
    if(!totalUsers)
        return res.redirect('setup')

    if(req.session.user && req.session.user.user_type === 'admin')
        res.redirect('dashboard')
    else
        res.render('dashboard-website-login', {
            title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
            error_message: '',
        })
})

router.post('/admin', async (req, res) => {
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
            res.render('dashboard-website-login', {
                title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
                error_message: 'Usuario no valido',
            })
            return
        }
        let result = await session.passwordIsEqual(user_pass, user.user_pass)
        if(!result) {
            throw new Error('Not valid user')
            return
        }
        if(user.user_type === 'admin') {
            req.session.user = {
                user_id: user.id.toString(),
                user_name: user.user_name,
                user_email: user.user_email,
                user_pass: user.user_pass,
                user_type: user.user_type,
            }
            res.redirect('dashboard')
            return
        }
        throw new Error('Not valid user')
    } catch(err) {
        res.render('dashboard-website-login', {
            title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
            error_message: err,
        })
    }
})

router.get('/admin-logout', (req, res) => {
    if(req.session.user) {
        let userID = req.session.user.user_id
        req.session.destroy((err) => {
            session.removeUserSession(userID)
            res.redirect('admin')
        })
    }
    else
        res.redirect('admin')
})

// end - website admin page login/out


// start - website login for other apps

router.get('/login', (req, res) => {
    res.render('login', {
        title: SITE_CONFIG.siteTitle,
        error_message: '',
    })
})

router.post('/login', async (req, res) => {
    try {
        const user_name = req.body.user_name
        const user_pass = req.body.user_pass
        let user = await modelUser.findOne({
            'user_name': user_name
        })
        if(!user) {
            throw new Error('Not valid user')
            return
        }
        let userValidation = await session.passwordIsEqual(user_pass, user.user_pass)
        if(userValidation) {
            req.session.user = {
                user_id: user.id.toString(),
                user_name: user.user_name,
                user_email: user.user_email,
            }
            res.redirect('example')
            return
        }
        throw new Error('Not valid user')
    } catch(err) {
        res.render('login', {
            title: SITE_CONFIG.siteTitle,
            error_message: err,
        })
    }
})

router.get('/register', (req, res) => {
    if(req.session.user) {
        if(req.session.user.user_type === 'client')
            res.redirect('example')
        else
            res.redirect('dashboard-seller')
    } else
        res.render('register', {
            title: SITE_CONFIG.siteTitle,
        })
})

router.post('/register', (req, res) => {
    // NOTE: complete this
    session.hashPassword(req.body.user_pass)
    .then(newPassword => {
        const user = new modelUser({
            user_name: req.body.user_name,
            user_pass: newPassword,
            user_email: req.body.user_email,
            user_first_name: '-',
            user_last_name: '-',
            user_type: req.body.user_type,
            user_registration_date: dateTime.create().format('Y-m-d H:M:S'),
            user_active: true,
        })
        user.save()
        .then(user => {
            res.json({
                status: 'User registered',
            })
        })
        .catch(err => {
            res.send({
                status: 'Error at register user',
                code: err,
            })
        })
    })
    .then(err => {
        res.send({
            status: 'Error at register user',
            code: 'Error creating the password',
            error_message: err,
        })
    })
})

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if(err)
                return next(err)
            else
                return res.redirect('/')
        })
    }
})

// end - website login for other apps


// start - website basic template routes

router.get('/', (req, res) => {
    res.render('default/index', {
        title: SITE_CONFIG.siteTitle,
    })
})

router.get('/:slug', routerException.slugException, async (req, res) => {
    try {
        let pageSlug = req.params.slug
        let page = await modelPage.findOne({
            'page_slug': pageSlug,
        })
        if(!page) {
            res.status(404).render('404', {
                title: SITE_CONFIG.siteTitle,
                status: 'Page not found',
                error_message: 'Route: '+req.url+' Not found.',
            })
            return
        }
        res.render('default/page-detail', {
            title: SITE_CONFIG.siteTitle,
            page: page,
        })
    } catch(err) {
        res.status(500).render('500', {
            title: SITE_CONFIG.siteTitle,
            status: 'Server error!',
            error_message: 'Route: '+req.url+' Not found.',
        })
    }
})

router.get('/blog', (req, res) => {
    res.redirect('/blog/page/1')
    return
})

router.get('/blog/page/:page', async (req, res) => {
    try {
        let currentPage = req.params.page
        let skipPosts = SITE_CONFIG.siteItemsPeerPage * (currentPage - 1)
        let [totalItems, items] = await Promise.all([
            modelPost.countDocuments(),
            modelPost.find().skip(skipPosts).limit(SITE_CONFIG.siteItemsPeerPage).exec()
        ])
        if(!items.length) {
            res.status(404).render('404', {
                title: SITE_CONFIG.siteTitle,
                status: 'Page not found',
                error_message: 'Route: '+req.url+' Not found.',
            })
            return
        }
        res.render('default/post-list', {
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
        res.status(500).render('500', {
            title: SITE_CONFIG.siteTitle,
            status: 'Server error!',
            error_message: 'Route: '+req.url+' Not found.',
        })
    }
})

router.get('/blog/:slug', async (req, res) => {
    let postSlug = req.params.slug
    try {
        let post = await modelPost.findOne({'post_slug': postSlug})
        res.render('default/post-detail', {
            title: SITE_CONFIG.siteTitle,
            post: post,
        })
    } catch(err) {
        res.status(500).render('500', {
            title: SITE_CONFIG.siteTitle,
            status: 'Server error!',
            error_message: 'Route: '+req.url+' Not found.',
        })
    }
})

// end - website basic template routes


// NOTE: admin dashboard app slug
router.get(['/:slugA', '/:slugA/:slugB*'], session.isAuthenticated, (req, res) => {
    let slugA = req.params.slugA
    let slugB = req.params.slugB
    if(slugA !== 'dashboard' || slugB === 'api')
        return req.next()

    res.render('dashboard-website-index', {
        title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
        user_id: req.session.user.user_id,
    })
})


module.exports = router
