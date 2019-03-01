const PostModel = require('../model/post-model')
const PageModel = require('../model/page-model')


const generatePostSlug = (id, slug) => {
  return new Promise((resolve, reject) => {
    const slugRegex = new RegExp(slug, 'i')
    PostModel.find({ 'post_slug': slugRegex, '_id': { $ne: id } })
      .then(post => {
        if(post.length)
          resolve(slug + '-' + post.length)
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
    PageModel.find({ 'page_slug': slugRegex, '_id': { $ne: id } })
      .then(page => {
        if (page.length)
          resolve(slug + '-' + page.length)
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
