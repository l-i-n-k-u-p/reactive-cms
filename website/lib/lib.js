const path = require('path')
const APP_GLOBAL = require('../../config/global.js')
const modelPost = require(path.join(APP_GLOBAL.appServerPath, '../models/post'))
const modelPage = require(path.join(APP_GLOBAL.appServerPath, '../models/page'))


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
