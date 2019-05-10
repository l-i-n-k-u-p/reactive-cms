const PostModel = require('../model/post-model')
const PageModel = require('../model/page-model')


const generatePostSlug = async (id, slug) => {
  try {
    const slugRegex = new RegExp(slug, 'i')
    let post = await PostModel.find({ 'post_slug': slugRegex, '_id': { $ne: id } })
      if(post.length)
        return slug + '-' + post.length

      return slug
  } catch (err) {
    return {
      error: err.toString()
    }
  }
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
