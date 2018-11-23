const path = require('path')
const express = require('express')
const router = express.Router()
const dateTime = require('node-datetime')
const slugify = require('slugify')

const APP_GLOBAL = require('../../config/global.js')
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config.js')
const modelUser = require(path.join(APP_GLOBAL.appServerPath, '../models/user'))
const modelPost = require(path.join(APP_GLOBAL.appServerPath, '../models/post'))
const modelPage = require(path.join(APP_GLOBAL.appServerPath, '../models/page'))
const session = require('../../lib/session')
const {
    generatePostSlug,
    generatePageSlug,
} = require('../lib/lib')
const { pushMessage } = require('../../lib/push-message')


// start - search

router.get('/search/:search', session.isAuthenticated, (req, res) => {
    let result_items = []
    const searchRegex = new RegExp(req.params.search, 'i')
    Promise.all([
        modelUser.find({'user_name': searchRegex}).select(['user_name']).exec(),
        modelPost.find({'post_title': searchRegex}).select(['post_title']).exec(),
        modelPage.find({'page_title': searchRegex}).select(['page_title']).exec(),
    ])
    .then(data => {
        res.json({
            items: data,
            status_code: 0,
            status_msg: '',
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error searching',
        })
    })
})

// end - search


// start - users

router.get('/users/:page', session.isAuthenticated, (req, res) => {
    let skipUsers = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
    modelUser.countDocuments()
    .then(totalUsers => {
        modelUser.find().select([
            'user_first_name',
            'user_last_name',
            'user_name',
            'user_email',
            'user_type',
            'user_registration_date',
            'user_active',
        ])
        .skip(skipUsers)
        .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST).exec()
        .then(users => {
            res.json({
                items: users,
                total_pages: Math.ceil(totalUsers/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
                items_skipped: skipUsers,
                total_items: totalUsers,
                status_code: 0,
                status_msg: '',
            })
        })
        .catch(err => {
            res.json({
                status_code: 1,
                status_msg: 'Error loading users',
            })
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error loading users',
        })
    })
})

router.get('/user/:id', session.isAuthenticated, (req, res) => {
    modelUser.findById(req.params.id, [
        'user_first_name',
        'user_last_name',
        'user_name',
        'user_email',
        'user_type',
        'user_active',
        'user_registration_date',
    ])
    .then(user => {
        res.json(user)
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'User not found',
        })
    })
})

router.post('/user/', session.isAuthenticated, (req, res) => {
    let newUser = new modelUser(req.body)
    newUser.user_registration_date = dateTime.create().format('Y-m-d H:M:S')
    session.hashPassword(newUser.user_pass)
    .then(newPassword => {
        newUser.user_pass = newPassword
        newUser.save()
        .then(user => {
            res.json({
                status_code: 0,
                status_msg: 'New user registered',
                data: {
                    id: newUser.id
                }
            })
            pushMessage.trigger('dashboard-user', 'post', {
                data: user
            })
        })
        .catch(err => {
            res.json({
                status_code: 1,
                status_msg: 'Error at register user',
            })
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error at register user',
        })
    })
})

router.put('/user/:id', session.isAuthenticated, (req, res, next) => {
    if(req.body.user_pass === '') {
        delete req.body.user_pass
        modelUser.findOneAndUpdate({'_id': req.params.id}, req.body, {new: true})
        .then(user => {
            session.userSessionDataChanged(user, req)
            .then(sessionFinished => {
                let message = 'User updated'
                if(sessionFinished)
                    message = 'User updated and session finished'
                res.json({
                    status_code: 0,
                    status_msg: message,
                })
                user.user_pass = ''
                pushMessage.trigger('dashboard-user', 'put', {
                    data: user
                })
            })
            .catch(err => {
                res.json({
                    status_code: 0,
                    status_msg: 'User updated',
                })
                user.user_pass = ''
                pushMessage.trigger('dashboard-user', 'put', {
                    data: user
                })
            })
        })
        .catch(err => {
            res.json({
                status_code: 1,
                status_msg: 'It could not update the user',
            })
        })
    } else {
        session.hashPassword(req.body.user_pass)
        .then(newPassword => {
            req.body.user_pass = newPassword
            modelUser.findOneAndUpdate({'_id': req.params.id}, req.body, {new: true})
            .then(user => {
                session.userSessionDataChanged(user, req)
                .then(sessionFinished => {
                    let message = 'User updated'
                    if(sessionFinished)
                        message = 'User updated and session finished'
                    res.json({
                        status_code: 0,
                        status_msg: message,
                    })
                    user.user_pass = ''
                    pushMessage.trigger('dashboard-user', 'put', {
                        data: user
                    })
                })
                .catch(err => {
                    res.json({
                        status_code: 0,
                        status_msg: 'User updated',
                    })
                    user.user_pass = ''
                    pushMessage.trigger('dashboard-user', 'put', {
                        data: user
                    })
                })
            })
            .catch(err => {
                res.json({
                    status_code: 1,
                    status_msg: 'It could not update the user update',
                })
            })
        })
        .catch(err => {
            res.json({
                status_code: 1,
                status_msg: 'It could not update the user',
            })
        })
    }
})

router.delete('/user/:id', session.isAuthenticated, (req, res, next) => {
    modelUser.findByIdAndRemove(req.params.id)
    .then(user => {
        session.removeUserSession(user._id)
        res.json({
            status_code: 0,
            status_msg: 'User deleted',
        })
        pushMessage.trigger('dashboard-user', 'delete', {
            data: user
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error at delete user',
        })
    })
})

// end - users


// start - posts

router.get('/post/:id', session.isAuthenticated, (req, res) => {
    modelPost.findById(req.params.id, (err, post) => {
        if(post)
            res.json(post)
        else
            res.json({
                status_code: 1,
                status_msg: 'Post not found',
            })
    })
})

router.post('/post/', session.isAuthenticated, (req, res) => {
    let newPost = new modelPost(req.body)
    let newPostSlug = slugify(req.body.post_title, {lower: true})
    generatePostSlug(null, newPostSlug)
    .then(slug => {
        newPost.post_date = dateTime.create().format('Y-m-d H:M:S')
        newPost.post_slug = slug
        newPost.save()
        .then(post => {
            res.json({
                status_code: 0,
                status_msg: 'New post registered',
                data: {
                    id: post.id
                },
            })
            pushMessage.trigger('dashboard-post', 'post', {
                data: post
            })
        })
        .catch(err => {
            res.json({
                status_code: 1,
                status_msg: 'Error at create post',
            })
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error at create post',
        })
    })
})

router.get('/posts/:page', session.isAuthenticated, (req, res) => {
    let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
    modelPost.countDocuments()
    .then(totalItems => {
        modelPost.find().skip(skipPosts).limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST).exec()
        .then(items => {
            res.json({
                items: items,
                total_pages: Math.ceil(totalItems/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
                items_skipped: skipPosts,
                total_items: totalItems,
                status_code: 0,
                status_msg: '',
            })
        })
        .catch(err => {
            res.json({
                status_code: 1,
                status_msg: 'Error loading the posts',
            })
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error loading the posts',
        })
    })
})

router.put('/post/:id', session.isAuthenticated, (req, res, next) => {
    modelPost.findById(req.params.id)
    .then(post => {
        post.post_content = req.body.post_content
        post.post_status = req.body.post_status
        if(post.post_title === req.body.post_title) {
            post.post_title = req.body.post_title
            post.save()
            .then(post => {
                res.json({
                    status_code: 0,
                    status_msg: 'Post updated',
                })
                pushMessage.trigger('dashboard-post', 'put', {
                    data: post
                })
            })
            .catch(err => {
                res.json({
                    status_code: 1,
                    status_msg: 'It was not updated',
                })
            })
        } else {
            let newPostSlug = slugify(req.body.post_title, {lower: true})
            generatePostSlug(post._id, newPostSlug)
            .then(slug => {
                post.post_title = req.body.post_title
                post.post_slug = slug
                post.save()
                .then(post => {
                    res.json({
                        status_code: 0,
                        status_msg: 'Post updated',
                    })
                    pushMessage.trigger('dashboard-post', 'put', {
                        data: post
                    })
                })
                .catch(err => {
                    res.json({
                        status_code: 1,
                        status_msg: 'It was not updated',
                    })
                })
            })
            .catch(err => {
                cres.json({
                    status_code: 1,
                    status_msg: 'It was not updated',
                })
            })
        }
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'It was not updated',
        })
    })
})

router.delete('/post/:id', session.isAuthenticated, (req, res, next) => {
    modelPost.findByIdAndRemove(req.params.id)
    .then(post => {
        res.json({
            status_code: 0,
            status_msg: 'Post deleted',
        })
        pushMessage.trigger('dashboard-post', 'delete', {
            data: post
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error at delete post',
        })
    })
})

// end - posts


// start - pages

router.get('/page/:id', session.isAuthenticated, (req, res) => {
    modelPage.findById(req.params.id, (err, page) => {
        if(page)
            res.json(page)
        else
            res.json({
                status_code: 1,
                status_msg: 'Post not found',
            })
    })
})

router.post('/page/', session.isAuthenticated, (req, res) => {
    let newPost = new modelPage(req.body)
    let newPostSlug = slugify(req.body.page_title, {lower: true})
    generatePageSlug(null, newPostSlug)
    .then(slug => {
        newPost.page_date = dateTime.create().format('Y-m-d H:M:S')
        newPost.page_slug = slug
        newPost.save()
        .then(page => {
            res.json({
                status_code: 0,
                status_msg: 'New page registered',
                data: {
                    id: page.id
                },
            })
            pushMessage.trigger('dashboard-page', 'page', {
                data: page
            })
        })
        .catch(err => {
            res.json({
                status_code: 1,
                status_msg: 'Error at create page',
            })
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error at create page',
        })
    })
})

router.get('/pages/:page', session.isAuthenticated, (req, res) => {
    let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
    modelPage.countDocuments()
    .then(totalItems => {
        modelPage.find().skip(skipPosts).limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST).exec()
        .then(items => {
            res.json({
                items: items,
                total_pages: Math.ceil(totalItems/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
                items_skipped: skipPosts,
                total_items: totalItems,
                status_code: 0,
                status_msg: '',
            })
        })
        .catch(err => {
            res.json({
                status_code: 1,
                status_msg: 'Error loading the pages',
            })
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error loading the pages',
        })
    })
})

router.put('/page/:id', session.isAuthenticated, (req, res, next) => {
    modelPage.findById(req.params.id)
    .then(page => {
        page.page_content = req.body.page_content
        page.page_status = req.body.page_status
        if(page.page_title === req.body.page_title) {
            page.page_title = req.body.page_title
            page.save()
            .then(page => {
                res.json({
                    status_code: 0,
                    status_msg: 'Post updated',
                })
                pushMessage.trigger('dashboard-page', 'put', {
                    data: page
                })
            })
            .catch(err => {
                res.json({
                    status_code: 1,
                    status_msg: 'It was not updated',
                })
            })
        } else {
            let newPostSlug = slugify(req.body.page_title, {lower: true})
            generatePageSlug(page._id, newPostSlug)
            .then(slug => {
                page.page_title = req.body.page_title
                page.page_slug = slug
                page.save()
                .then(page => {
                    res.json({
                        status_code: 0,
                        status_msg: 'Post updated',
                    })
                    pushMessage.trigger('dashboard-page', 'put', {
                        data: page
                    })
                })
                .catch(err => {
                    res.json({
                        status_code: 1,
                        status_msg: 'It was not updated',
                    })
                })
            })
            .catch(err => {
                cres.json({
                    status_code: 1,
                    status_msg: 'It was not updated',
                })
            })
        }
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'It was not updated',
        })
    })
})

router.delete('/page/:id', session.isAuthenticated, (req, res, next) => {
    modelPage.findByIdAndRemove(req.params.id)
    .then(page => {
        res.json({
            status_code: 0,
            status_msg: 'Post deleted',
        })
        pushMessage.trigger('dashboard-page', 'delete', {
            data: page
        })
    })
    .catch(err => {
        res.json({
            status_code: 1,
            status_msg: 'Error at delete page',
        })
    })
})

// end - pages


module.exports = router
