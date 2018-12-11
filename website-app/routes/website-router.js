const path = require('path')
const express = require('express')
const router = express.Router()
const dateTime = require('node-datetime')

const APP_GLOBAL = require('../../config/global.js')
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config.js')
const session = require('../../lib/session')
const modelUser = require(path.join(APP_GLOBAL.appServerPath, '../models/user'))
const modelSetting = require(path.join(APP_GLOBAL.appServerPath, '../models/setting'))


// start - website setup page

router.get('/setup', async (req, res) => {
    let totalUsers = await modelUser.countDocuments()
    if(totalUsers)
        return res.redirect('admin')

    res.render('setup.html', {
        title: 'SETUP',
        error_message: ''
    })
})

router.post('/setup', async (req, res) => {
    let totalUsers = await modelUser.countDocuments()
    if(totalUsers)
        return res.redirect('admin')

    let setup_site_name = req.body.setup_site_name
    let setup_first_name = req.body.setup_first_name
    let setup_user_email = req.body.setup_user_email
    let setup_user_name = req.body.setup_user_name
    let setup_user_pass = req.body.setup_user_pass
    if(!setup_site_name && !setup_first_name && !setup_user_name && !setup_user_pass) {
        res.render('setup.html', {title: 'SETUP', error_message: 'Complete the request data'})
    } else {
        let user = new modelUser()
        let settings = new modelSetting()
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
            let userSaved = await user.save()
            let settingSaved = await settings.save()
            res.redirect('admin')
        } catch(err) {
            res.render('setup.html', {title: 'SETUP', error_message: err.toString()})
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
        res.render('dashboard-website-login.html', {title: 'WEBSITE ADMIN LOGIN', error_message: ''})
})

router.post('/admin', async (req, res) => {
    let totalUsers = await modelUser.countDocuments()
    if(!totalUsers)
        return res.redirect('setup')

    const user_name = req.body.user_name
    const user_pass = req.body.user_pass
    modelUser.findOne({
        'user_name': user_name
    })
    .then(user => {
        if(!user) {
            res.render('dashboard-website-login.html', {title: APP_GLOBAL.websiteName, error_message: 'Usuario no valido'})
        } else {
            session.passwordIsEqual(user_pass, user.user_pass)
            .then(result => {
                if(result) {
                    // redirect to dashboard page
                    if(user.user_type === 'admin') {
                        req.session.user = {
                            user_id: user.id.toString(),
                            user_name: user.user_name,
                            user_email: user.user_email,
                            user_pass: user.user_pass,
                            user_type: user.user_type,
                        }
                        res.redirect('dashboard')
                    } else
                        res.render('dashboard-website-login.html', {title: 'WEBSITE ADMIN LOGIN', error_message:  'Not valid user'})
                } else {
                    // redirect to login page with message error
                    res.render('dashboard-website-login.html', {title: 'WEBSITE ADMIN LOGIN', error_message: 'Not valid user'})
                }
            })
            .catch(err => {
                // redirect to login page with message error
                res.render('dashboard-website-login.html', {title: 'WEBSITE ADMIN LOGIN', error_message: err})
            })
        }
    })
    .catch(err => {
        res.render('dashboard-website-login.html', {title: 'WEBSITE ADMIN LOGIN', error_message: err})
    })
})

router.get('/admin-logout', (req, res) => {
    if (req.session) {
        // delete session object
        req.session.destroy((err) => {
            if(err)
                return next(err)
            else
                return res.redirect('admin')
        })
    }
})

// end - website admin page login/out



// start - website login for other apps

router.get('/', (req, res) => {
    res.render('index.html', {title: APP_GLOBAL.websiteName})
})

router.get('/login', (req, res) => {
    if(req.session.user) {
        if(req.session.user.user_type === 'client')
            res.redirect('dashboard-client')
        else
            res.redirect('dashboard-seller')
    } else
        res.render('login.html', {title: APP_GLOBAL.websiteName, error_message: ''})
})

router.post('/login', (req, res) => {
    const user_name = req.body.user_name
    const user_pass = req.body.user_pass
    modelUser.findOne({
        'user_name': user_name
    })
    .then(user => {
        if(!user) {
            res.render('login.html', {title: APP_GLOBAL.websiteName, error_message: 'Usuario no valido'})
        } else {
            session.passwordIsEqual(user_pass, user.user_pass, userValidation => {
                if(userValidation.user_valid) {
                    // redirect to page
                    if(user.user_type === 'client') {
                        // req.session.user = user
                        req.session.user = {
                            user_id: user.id.toString(),
                            user_name: user.user_name,
                            user_email: user.user_email,
                        }
                        res.redirect('dashboard-client')
                    } else if(user.user_type === 'seller') {
                        // req.session.user = user
                        req.session.user = {
                            user_id: user.id.toString(),
                            user_name: user.user_name,
                            user_email: user.user_email,
                        }
                        res.redirect('dashboard-seller')
                    }
                } else {
                    // redirect to login page with message error
                    res.render('login.html', {title: APP_GLOBAL.websiteName, error_message: 'Usuario no valido'})
                }
            })
        }
    })
    .catch(err => {
        res.render('login.html', {title: APP_GLOBAL.websiteName, error_message: err})
    })
})

router.get('/register', (req, res) => {
    if(req.session.user) {
        if(req.session.user.user_type === 'client')
            res.redirect('dashboard-client')
        else
            res.redirect('dashboard-seller')
    } else
        res.render('register.html', {title: APP_GLOBAL.websiteName})
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
            res.status(200).json({
                status: 'User registered',
            })
        })
        .catch(err => {
            res.status(400).send({
                status: 'Error at register user',
                code: err,
            })
        })
    })
    .then(err => {
        res.status(400).send({
            status: 'Error at register user',
            code: 'Error creating the password',
            error_message: err,
        })
    })
})

router.get('/logout', (req, res) => {
    if (req.session) {
        // delete session object
        req.session.destroy((err) => {
            if(err)
                return next(err)
            else
                return res.redirect('/')
        })
    }
})

// end - website login for other apps


router.get('/dashboard*', session.isAuthenticated, (req, res) => {
    res.render('dashboard-website-index.html', {
        title: 'WEBSITE DASHBOARD',
        user_id: req.session.user.user_id,
    })
})


module.exports = router
