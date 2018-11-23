const path = require('path')
const express = require('express')
const router = express.Router()
const dateTime = require('node-datetime')

const APP_GLOBAL = require('../../config/global.js')
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config.js')
const session = require('../../lib/session')
const modelUser = require(path.join(APP_GLOBAL.appServerPath, '../models/user'))


// start - website admin page login/out

router.get('/admin', (req, res) => {
    if(req.session.user && req.session.user.user_type === 'admin') {
        res.redirect('dashboard-website')
    } else
        res.render('dashboard-website-login.html', {title: 'WEBSITE ADMIN LOGIN', error_message: ''})
})

router.post('/admin', (req, res) => {
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
