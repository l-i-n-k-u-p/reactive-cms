const UserModel = require('../user/model')
const PostModel = require('../post/model')
const PageModel = require('../page/model')
const MediaModel = require('../media/model')
const RoleModel = require('../role/model')


const getItemsWithWord = async (word) => {
  try {
    const searchRegex = new RegExp(word, 'i')
    let items = await Promise.all([
      UserModel.find({ 'user_name': searchRegex }).select(['user_name']).exec(),
      PostModel.find({ 'post_title': searchRegex }).select(['post_title']).exec(),
      PageModel.find({ 'page_title': searchRegex }).select(['page_title']).exec(),
      MediaModel.find({ 'media_title': searchRegex }).select(['media_title']).exec(),
      RoleModel.find({ 'role_name': searchRegex }).select(['role_name']).exec(),
    ])
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

const searchMedia = async (objectData) => {
  try {
    const searchRegex = new RegExp(objectData.search_word, 'i')
    const mimetypeRegex = new RegExp(objectData.search_mimetype, 'i')
    let items = await MediaModel.find({
      'media_title': searchRegex,
      'media_mime_type': mimetypeRegex,
    })
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getItemsWithWord: getItemsWithWord,
  searchMedia: searchMedia,
}
