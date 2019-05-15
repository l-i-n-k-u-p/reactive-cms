const mongoose = require('mongoose')
const Schema = mongoose.Schema


const PostModel = new Schema({
  post_title: { type: String, trim: true, required: true },
  post_content: { type: String, trim: true, required: true },
  post_thumbnail: { type: Object },
  post_slug: { type: String, trim: true, required: true },
  post_date: { type: String, required: true },
  post_status: { type: String, required: true },
  post_user_ref: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  collection: 'post'
})

PostModel.virtual('model_name').get(() => {
  return 'post'
})

PostModel.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('PostModel', PostModel)
