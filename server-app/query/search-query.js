const UserModel = require('../model/user-model')
const PostModel = require('../model/post-model')
const PageModel = require('../model/page-model')
const MediaModel = require('../model/media-model')
const RoleModel = require('../model/role-model')


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
      error: err.toString()
    }
  }
}

module.exports = {
  getItemsWithWord: getItemsWithWord,
}
