const UserModel = require('../user/model')
const PostModel = require('../post/model')
const PageModel = require('../page/model')
const MediaModel = require('../media/model')


const getLog = async (word) => {
  try {
    let items = await Promise.all([
      UserModel.countDocuments(),
      PostModel.countDocuments(),
      PageModel.countDocuments(),
      MediaModel.countDocuments(),
      UserModel.find()
        .select([
          'user_first_name',
          'user_last_name',
          'user_name',
          'user_email',
          'user_active',
          'user_registration_date',
          'user_thumbnail',
          'user_avatar',
        ]).sort({ 'user_registration_date': 'desc' }).limit(3),
      PostModel.find().sort({'post_date': 'desc'}).limit(3),
      PageModel.find().sort({'page_date': 'desc'}).limit(3),
      MediaModel.find().sort({'media_date': 'desc'}).limit(3),
    ])
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getLog: getLog,
}
