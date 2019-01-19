const path = require('path')

const APP_GLOBAL = require('../../config/global')

const modelPost = require('../model/post')
const modelPage = require('../model/page')


const generatePostSlug = (id, slug) => {
    return new Promise((resolve, reject) => {
        const slugRegex = new RegExp(slug, 'i')
        modelPost.find({'post_slug': slugRegex, '_id': {$ne: id}})
        .then(post => {
            if(post.length)
                resolve(slug+'-'+post.length)
            else
                resolve(slug)
        })
        .catch(err => {
            reject(err)
        })
    })
}

const generatePageSlug = (id, slug) => {
    return new Promise((resolve, reject) => {
        const slugRegex = new RegExp(slug, 'i')
        modelPage.find({'page_slug': slugRegex, '_id': {$ne: id}})
        .then(page => {
            if(page.length)
                resolve(slug+'-'+page.length)
            else
                resolve(slug)
        })
        .catch(err => {
            reject(err)
        })
    })
}


module.exports = {
    generatePostSlug: generatePostSlug,
    generatePageSlug: generatePageSlug,
}
