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
const modelMedia = require(path.join(APP_GLOBAL.appServerPath, '../models/media'))
const modelSetting = require(path.join(APP_GLOBAL.appServerPath, '../models/setting'))
const session = require('../../lib/session')
const {
    generatePostSlug,
    generatePageSlug,
} = require('../lib/lib')
const { pushMessage } = require('../../lib/push-message')
const { mediaUpload } = require('../../lib/media-upload')


// start - search

router.get('/search/', session.isAuthenticated, async (req, res) => {
    try {
        const searchRegex = new RegExp(req.query.search, 'i')
        let data = await Promise.all([
            modelUser.find({'user_name': searchRegex}).select(['user_name']).exec(),
            modelPost.find({'post_title': searchRegex}).select(['post_title']).exec(),
            modelPage.find({'page_title': searchRegex}).select(['page_title']).exec(),
            modelMedia.find({'media_title': searchRegex}).select(['media_title']).exec(),
        ])
        res.json({
            items: data,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error searching',
        })
    }
})

router.get('/search-media/', session.isAuthenticated, async (req, res) => {
    try {
        const searchRegex = new RegExp(req.query.search, 'i')
        const mimetypeRegex = new RegExp(req.query.mimetype, 'i')
        let data = await modelMedia.find({
            'media_title': searchRegex,
            'media_mime_type': mimetypeRegex
        }).exec()
        res.json({
            items: data,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error searching',
        })
    }
})

// end - search


// start - users

router.get('/users/:page', session.isAuthenticated, async (req, res) => {
    try {
        let skipUsers = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
        let [totalUsers, users] = await Promise.all([
            modelUser.countDocuments(),
            modelUser.find().select([
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
            .skip(skipUsers)
            .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST).exec(),
        ])
        res.json({
            items: users,
            total_pages: Math.ceil(totalUsers/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
            items_skipped: skipUsers,
            total_items: totalUsers,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error loading users',
        })
    }
})

router.get('/user/:id', session.isAuthenticated, async (req, res) => {
    try {
        let user = await modelUser.findById(req.params.id, [
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
        res.json(user)
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'User not found',
        })
    }
})

router.post('/user/', session.isAuthenticated, async (req, res) => {
    try {
        let newUser = new modelUser(req.body)
        newUser.user_registration_date = dateTime.create().format('Y-m-d H:M:S')
        let newPassword = await session.hashPassword(newUser.user_pass)
        newUser.user_pass = newPassword
        let user = await newUser.save()
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
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error at register user',
        })
    }
})

router.put('/user/:id', session.isAuthenticated, async (req, res, next) => {
    if(req.body.user_pass === '') {
        try {
            delete req.body.user_pass
            let user = await modelUser.findOneAndUpdate({'_id': req.params.id}, req.body, {new: true})
            let sessionFinished = await session.userSessionDataChanged(user, req)
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
        } catch(err) {
            res.json({
                status_code: 1,
                status_msg: 'It could not update the user',
            })
        }
    } else {
        try {
            let newPassword = await session.hashPassword(req.body.user_pass)
            req.body.user_pass = newPassword
            let user = await modelUser.findOneAndUpdate({'_id': req.params.id}, req.body, {new: true})
            let sessionFinished = await session.userSessionDataChanged(user, req)
            console.log('== sessionFinished ==', sessionFinished)
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
        } catch(err) {
            res.json({
                status_code: 1,
                status_msg: 'It could not update the user',
            })
        }
    }
})

router.delete('/user/:id', session.isAuthenticated, async (req, res, next) => {
    try {
        let user = await modelUser.findByIdAndRemove(req.params.id)
        session.removeUserSession(user._id)
        res.json({
            status_code: 0,
            status_msg: 'User deleted',
        })
        pushMessage.trigger('dashboard-user', 'delete', {
            data: user
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error at delete user',
        })
    }
})

// end - users


// start - posts

router.get('/post/:id', session.isAuthenticated, async (req, res) => {
    try {
        let post = await modelPost.findById(req.params.id)
        res.json(post)
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Post not found',
        })
    }
})

router.post('/post/', session.isAuthenticated, async (req, res) => {
    try {
        let newPost = new modelPost(req.body)
        let newPostSlug = slugify(req.body.post_title, {lower: true})
        let slug = await generatePostSlug(null, newPostSlug)
        newPost.post_date = dateTime.create().format('Y-m-d H:M:S')
        newPost.post_slug = slug
        let post = await newPost.save()
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
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error at create post',
        })
    }
})

router.get('/posts/:page', session.isAuthenticated, async (req, res) => {
    try {
        let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
        let [totalItems, items] = await Promise.all([
            modelPost.countDocuments(),
            modelPost.find().skip(skipPosts).limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST).exec()
        ])
        res.json({
            items: items,
            total_pages: Math.ceil(totalItems/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
            items_skipped: skipPosts,
            total_items: totalItems,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error loading the posts',
        })
    }
})

router.put('/post/:id', session.isAuthenticated, async (req, res, next) => {
    try {
        let post = await modelPost.findById(req.params.id)
        post.post_content = req.body.post_content
        post.post_status = req.body.post_status
        post.post_thumbnail = req.body.post_thumbnail
        if(post.post_title === req.body.post_title) {
            post.post_title = req.body.post_title
            let postSaved = await post.save()
            res.json({
                status_code: 0,
                status_msg: 'Post updated',
            })
            pushMessage.trigger('dashboard-post', 'put', {
                data: postSaved
            })
        } else {
            let newPostSlug = slugify(req.body.post_title, {lower: true})
            let slug = await generatePostSlug(post._id, newPostSlug)
            post.post_title = req.body.post_title
            post.post_slug = slug
            let postSaved = await post.save()
            res.json({
                status_code: 0,
                status_msg: 'Post updated',
            })
            pushMessage.trigger('dashboard-post', 'put', {
                data: postSaved
            })
        }
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'It was not updated',
        })
    }
})

router.delete('/post/:id', session.isAuthenticated, async (req, res, next) => {
    try {
        let post = await modelPost.findByIdAndRemove(req.params.id)
        res.json({
            status_code: 0,
            status_msg: 'Post deleted',
        })
        pushMessage.trigger('dashboard-post', 'delete', {
            data: post
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error at delete post',
        })
    }
})

// end - posts


// start - pages

router.get('/page/:id', session.isAuthenticated, async (req, res) => {
    try {
        let page = await modelPage.findById(req.params.id)
        res.json(page)
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Page not found',
        })
    }
})

router.post('/page/', session.isAuthenticated, async (req, res) => {
    try {
        let newPost = new modelPage(req.body)
        let newPostSlug = slugify(req.body.page_title, {lower: true})
        let slug = await generatePageSlug(null, newPostSlug)
        newPost.page_date = dateTime.create().format('Y-m-d H:M:S')
        newPost.page_slug = slug
        let page = await newPost.save()
        res.json({
            status_code: 0,
            status_msg: 'New page registered',
            data: {
                id: page.id
            },
        })
        pushMessage.trigger('dashboard-page', 'post', {
            data: page
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error at create page',
        })
    }
})

router.get('/pages/:page', session.isAuthenticated, async (req, res) => {
    try {
        let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
        let [totalItems, items] = await Promise.all([
            modelPage.countDocuments(),
            modelPage.find().skip(skipPosts).limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST).exec()
        ])
        res.json({
            items: items,
            total_pages: Math.ceil(totalItems/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
            items_skipped: skipPosts,
            total_items: totalItems,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error loading the pages',
        })
    }
})

router.put('/page/:id', session.isAuthenticated, async (req, res, next) => {
    try {
        let page = await modelPage.findById(req.params.id)
        page.page_content = req.body.page_content
        page.page_status = req.body.page_status
        page.page_thumbnail = req.body.page_thumbnail
        if(page.page_title === req.body.page_title) {
            page.page_title = req.body.page_title
            let pageSaved = await page.save()
            res.json({
                status_code: 0,
                status_msg: 'Post updated',
            })
            pushMessage.trigger('dashboard-page', 'put', {
                data: pageSaved
            })
        } else {
            let newPostSlug = slugify(req.body.page_title, {lower: true})
            let slug = await generatePageSlug(page._id, newPostSlug)
            page.page_title = req.body.page_title
            page.page_slug = slug
            let pageSaved = await page.save()
            res.json({
                status_code: 0,
                status_msg: 'Post updated',
            })
            pushMessage.trigger('dashboard-page', 'put', {
                data: pageSaved
            })
        }
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'It was not updated',
        })
    }
})

router.delete('/page/:id', session.isAuthenticated, async (req, res, next) => {
    try {
        let page = await modelPage.findByIdAndRemove(req.params.id)
        res.json({
            status_code: 0,
            status_msg: 'Post deleted',
        })
        pushMessage.trigger('dashboard-page', 'delete', {
            data: page
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error at delete page',
        })
    }
})

// end - pages


// start - media

router.get('/media-file/:id', session.isAuthenticated, async (req, res) => {
    try {
        let media = await modelMedia.findById(req.params.id)
        if(media)
            res.json(media)
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Media not found',
        })
    }
})

router.post('/media-file/', session.isAuthenticated, async (req, res) => {
    try {
        let resultUpload = await mediaUpload(req, res)
        if(!resultUpload.fileData)
            throw new Error('Error at upload file')
        let newMedia = new modelMedia({
            media_original_name: resultUpload.fileData.originalname,
            media_name: resultUpload.fileData.filename,
            media_title: resultUpload.postData.media_title,
            media_mime_type: resultUpload.fileData.mimetype,
            media_size: resultUpload.fileData.size,
            media_path: resultUpload.fileData.path,
            media_date: dateTime.create().format('Y-m-d H:M:S'),
        })
        let media = await newMedia.save()
        res.json({
            status_code: 0,
            status_msg: 'New media added',
            data: {
                id: media.id
            },
        })
        pushMessage.trigger('dashboard-media', 'post', {
            data: media
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error at upload media',
        })
    }
})

router.get('/media-files/:page', session.isAuthenticated, async (req, res) => {
    try {
        let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
        let totalItems = await modelMedia.countDocuments()
        let items = await modelMedia.find().skip(skipPosts).limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST).exec()
        res.json({
            items: items,
            total_pages: Math.ceil(totalItems/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
            items_skipped: skipPosts,
            total_items: totalItems,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error loading the media',
        })
    }
})

router.put('/media-file/:id', session.isAuthenticated, async (req, res, next) => {
    try {
        let media = await modelMedia.findById(req.params.id)
        media.media_content = req.body.media_content
        media.media_status = req.body.media_status
        if(media.media_title === req.body.media_title) {
            media.media_title = req.body.media_title
            let resMedia = await media.save()
            res.json({
                status_code: 0,
                status_msg: 'Post updated',
            })
            pushMessage.trigger('dashboard-media', 'put', {
                data: resMedia
            })
        } else {
            let newMediaSlug = slugify(req.body.media_title, {lower: true})
            let slug = await generatePageSlug(media._id, newMediaSlug)
            media.media_title = req.body.media_title
            media.media_slug = slug
            let resMedia = await media.save()
            res.json({
                status_code: 0,
                status_msg: 'Post updated',
            })
            pushMessage.trigger('dashboard-media', 'put', {
                data: resMedia
            })
        }
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'It was not updated',
        })
    }
})

router.delete('/media-file/:id', session.isAuthenticated, async (req, res, next) => {
    try {
        let media = await modelMedia.findByIdAndRemove(req.params.id)
        res.json({
            status_code: 0,
            status_msg: 'Media deleted',
        })
        pushMessage.trigger('dashboard-media', 'delete', {
            data: media
        })
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Error at delete media',
        })
    }
})

// end - media


// start - setting

router.get('/setting/', session.isAuthenticated, async (req, res) => {
    try {
        let settings = await modelSetting.findOne()
        res.json(settings)
    } catch(err) {
        res.json({
            status_code: 1,
            status_msg: 'Settings not found',
        })
    }
})

router.put('/setting/', session.isAuthenticated, async (req, res) => {
    if(req.body)
        try {
            let settings = await modelSetting.findOneAndUpdate({'_id': req.body.id}, req.body, {new: true})
            res.json({
                status_code: 0,
                status_msg: 'Settings updated',
            })
            pushMessage.trigger('dashboard-setting', 'put', {
                data: settings
            })
        } catch(err) {
            res.json({
                status_code: 1,
                status_msg: 'It could not update the settings',
            })
        }
})

// end - setting


module.exports = router
