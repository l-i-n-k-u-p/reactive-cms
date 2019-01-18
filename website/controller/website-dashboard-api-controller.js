const path = require('path')
const dateTime = require('node-datetime')
const slugify = require('slugify')

const APP_GLOBAL = require('../../config/global')
const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')
const SITE_CONFIG = require('../../config/site-config')
const modelUser = require(path.join('../model/user'))
const modelPost = require(path.join('../model/post'))
const modelPage = require(path.join('../model/page'))
const modelMedia = require(path.join('../model/media'))
const modelSetting = require(path.join('../model/setting'))
const modelSite = require(path.join('../model/site'))
const session = require('../../lib/session')
const {
    generatePostSlug,
    generatePageSlug,
} = require('../lib/lib')
const { pushMessage } = require('../../lib/push-message')
const { mediaUpload } = require('../../lib/media-upload')


exports.search = async (req, res) => {
    try {
        const searchRegex = new RegExp(req.query.search, 'i')
        let data = await Promise.all([
            modelUser.find({'user_name': searchRegex}).select(['user_name']).exec(),
            modelPost.find({'post_title': searchRegex}).select(['post_title']).exec(),
            modelPage.find({'page_title': searchRegex}).select(['page_title']).exec(),
            modelMedia.find({'media_title': searchRegex}).select(['media_title']).exec(),
        ])
        res.send({
            items: data,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
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
        let data = await modelMedia.find({
            'media_title': searchRegex,
            'media_mime_type': mimetypeRegex
        }).exec()
        res.send({
            items: data,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
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
            .sort({'user_registration_date': 'desc'})
            .skip(skipUsers)
            .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST).exec(),
        ])
        res.send({
            items: users,
            total_pages: Math.ceil(totalUsers/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
            items_skipped: skipUsers,
            total_items: totalUsers,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Error loading users',
        })
    }
}

exports.getUserByID = async (req, res) => {
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
        res.send(user)
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'User not found',
        })
    }
}

exports.addNewUser = async (req, res) => {
    try {
        let newUser = new modelUser(req.body)
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
        pushMessage.trigger('dashboard-user', 'post', {
            data: user
        })
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: err.toString(),
        })
    }
}

exports.updaterUserByID = async (req, res) => {
    if(req.body.user_pass === '') {
        try {
            delete req.body.user_pass
            let user = await modelUser.findOneAndUpdate({'_id': req.params.id}, req.body, {new: true})
            let sessionFinished = await session.currentUserSessionDataChanged(user, req)
            let message = 'User updated'
            if(sessionFinished)
                message = 'User updated and session finished'
            res.send({
                status_code: 0,
                status_msg: message,
            })
            user.user_pass = ''
            pushMessage.trigger('dashboard-user', 'put', {
                data: user
            })
        } catch(err) {
            res.send({
                status_code: 1,
                status_msg: 'It could not update the user',
            })
        }
    } else {
        try {
            let newPassword = await session.hashPassword(req.body.user_pass)
            req.body.user_pass = newPassword
            let user = await modelUser.findOneAndUpdate({'_id': req.params.id}, req.body, {new: true})
            let sessionFinished = await session.currentUserSessionDataChanged(user, req)
            session.removeUserSessionOnDB(user._id)
            let message = 'User updated'
            if(sessionFinished)
                message = 'User updated and session finished'
            res.send({
                status_code: 0,
                status_msg: message,
            })
            user.user_pass = ''
            pushMessage.trigger('dashboard-user', 'put', {
                data: user
            })
        } catch(err) {
            res.send({
                status_code: 1,
                status_msg: 'It could not update the user',
            })
        }
    }
}

exports.deleteUserByID = async (req, res) => {
    try {
        let user = await modelUser.findByIdAndRemove(req.params.id)
        session.removeUserSessionOnDB(user._id)
        res.send({
            status_code: 0,
            status_msg: 'User deleted',
        })
        pushMessage.trigger('dashboard-user', 'delete', {
            data: user
        })
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Error at delete user',
        })
    }
}

exports.getPostByID = async (req, res) => {
    try {
        let post = await modelPost.findById(req.params.id)
        res.send(post)
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Post not found',
        })
    }
}

exports.addNewPost = async (req, res) => {
    try {
        let newPost = new modelPost(req.body)
        let newPostSlug = slugify(req.body.post_title, {lower: true})
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
        pushMessage.trigger('dashboard-post', 'post', {
            data: post
        })
    } catch(err) {
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
            modelPost.countDocuments(),
            modelPost.find()
            .skip(skipPosts)
            .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST)
            .sort({'post_date': 'desc'})
            .exec()
        ])
        res.send({
            items: items,
            total_pages: Math.ceil(totalItems/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
            items_skipped: skipPosts,
            total_items: totalItems,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Error loading the posts',
        })
    }
}

exports.updatePostByID = async (req, res) => {
    try {
        let post = await modelPost.findById(req.params.id)
        post.post_content = req.body.post_content
        post.post_status = req.body.post_status
        post.post_thumbnail = req.body.post_thumbnail
        if(post.post_title === req.body.post_title) {
            post.post_title = req.body.post_title
            let postSaved = await post.save()
            res.send({
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
            res.send({
                status_code: 0,
                status_msg: 'Post updated',
            })
            pushMessage.trigger('dashboard-post', 'put', {
                data: postSaved
            })
        }
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'It was not updated',
        })
    }
}

exports.deletePostByID = async (req, res) => {
    try {
        let post = await modelPost.findByIdAndRemove(req.params.id)
        res.send({
            status_code: 0,
            status_msg: 'Post deleted',
        })
        pushMessage.trigger('dashboard-post', 'delete', {
            data: post
        })
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Error at delete post',
        })
    }
}

exports.getPageByID = async (req, res) => {
    try {
        let page = await modelPage.findById(req.params.id)
        res.send(page)
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Page not found',
        })
    }
}

exports.addNewPage = async (req, res) => {
    try {
        let newPost = new modelPage(req.body)
        let newPostSlug = slugify(req.body.page_title, {lower: true})
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
        pushMessage.trigger('dashboard-page', 'post', {
            data: page
        })
    } catch(err) {
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
            modelPage.countDocuments(),
            modelPage.find()
            .skip(skipPosts)
            .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST)
            .sort({'page_date': 'desc'})
            .exec()
        ])
        res.send({
            items: items,
            total_pages: Math.ceil(totalItems/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
            items_skipped: skipPosts,
            total_items: totalItems,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Error loading the pages',
        })
    }
}

exports.updatePageByID = async (req, res) => {
    try {
        let page = await modelPage.findById(req.params.id)
        page.page_content = req.body.page_content
        page.page_status = req.body.page_status
        page.page_thumbnail = req.body.page_thumbnail
        if(page.page_title === req.body.page_title) {
            page.page_title = req.body.page_title
            let pageSaved = await page.save()
            res.send({
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
            res.send({
                status_code: 0,
                status_msg: 'Post updated',
            })
            pushMessage.trigger('dashboard-page', 'put', {
                data: pageSaved
            })
        }
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'It was not updated',
        })
    }
}

exports.deletePageByID = async (req, res) => {
    try {
        let page = await modelPage.findByIdAndRemove(req.params.id)
        res.send({
            status_code: 0,
            status_msg: 'Post deleted',
        })
        pushMessage.trigger('dashboard-page', 'delete', {
            data: page
        })
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Error at delete page',
        })
    }
}

exports.getMediaByID = async (req, res) => {
    try {
        let media = await modelMedia.findById(req.params.id)
        if(!media)
            throw new Error('Media not found')
        res.send(media)
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Media not found',
        })
    }
}

exports.addNewMedia = async (req, res) => {
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
        res.send({
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
        res.send({
            status_code: 1,
            status_msg: 'Error at upload media',
        })
    }
}

exports.getMediaByPage = async (req, res) => {
    try {
        let skipPosts = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
        let totalItems = await modelMedia.countDocuments()
        let items = await modelMedia.find()
            .skip(skipPosts)
            .limit(DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST)
            .sort({'media_date': 'desc'})
            .exec()
        res.send({
            items: items,
            total_pages: Math.ceil(totalItems/DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
            items_skipped: skipPosts,
            total_items: totalItems,
            status_code: 0,
            status_msg: '',
        })
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Error loading the media',
        })
    }
}

exports.updateMediaByID = async (req, res) => {
    try {
        let media = await modelMedia.findById(req.params.id)
        media.media_content = req.body.media_content
        media.media_status = req.body.media_status
        if(media.media_title === req.body.media_title) {
            media.media_title = req.body.media_title
            let resMedia = await media.save()
            res.send({
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
            res.send({
                status_code: 0,
                status_msg: 'Post updated',
            })
            pushMessage.trigger('dashboard-media', 'put', {
                data: resMedia
            })
        }
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'It was not updated',
        })
    }
}

exports.deleteMediaByID = async (req, res) => {
    try {
        let media = await modelMedia.findByIdAndRemove(req.params.id)
        res.send({
            status_code: 0,
            status_msg: 'Media deleted',
        })
        pushMessage.trigger('dashboard-media', 'delete', {
            data: media
        })
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Error at delete media',
        })
    }
}

exports.getSettings = async (req, res) => {
    try {
        let settings = await modelSetting.findOne()
        res.send(settings)
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Settings not found',
        })
    }
}

exports.updateSettings = async (req, res) => {
    if(req.body)
        try {
            let settings = await modelSetting.findOneAndUpdate({'_id': req.body.id}, req.body, {new: true})
            DASHBOARD_ADMIN_CONFIG.loadDashboardSettings()
            res.send({
                status_code: 0,
                status_msg: 'Settings updated',
            })
            pushMessage.trigger('dashboard-setting', 'put', {
                data: settings
            })
        } catch(err) {
            res.send({
                status_code: 1,
                status_msg: 'It could not update the settings',
            })
        }
}

exports.getSiteSettings = async (req, res) => {
    try {
        let siteSettings = await modelSite.findOne()
        res.send(siteSettings)
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Site settings not found',
        })
    }
}

exports.updateSiteSettings = async (req, res) => {
    if(req.body)
        try {
            let siteSettings = await modelSite.findOneAndUpdate({'_id': req.body.id}, req.body, {new: true})
            SITE_CONFIG.loadSiteSettings()
            res.send({
                status_code: 0,
                status_msg: 'Settings updated',
            })
            pushMessage.trigger('dashboard-site', 'put', {
                data: siteSettings
            })
        } catch(err) {
            res.send({
                status_code: 1,
                status_msg: 'It could not update the site settings',
            })
        }
}

exports.getDashboard = async (req, res) => {
    try {
        let data = await Promise.all([
            modelUser.countDocuments(),
            modelPost.countDocuments(),
            modelPage.countDocuments(),
            modelMedia.countDocuments(),
            modelUser.find()
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
            ]).sort({'user_registration_date': 'desc'}).limit(3),
            modelPost.find().sort({'post_date': 'desc'}).limit(3),
            modelPage.find().sort({'page_date': 'desc'}).limit(3),
            modelMedia.find().sort({'media_date': 'desc'}).limit(3),
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
    } catch(err) {
        res.send({
            status_code: 1,
            status_msg: 'Error loading Dashboard Info',
        })
    }
}
