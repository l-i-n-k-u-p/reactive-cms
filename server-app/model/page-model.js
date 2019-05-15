const mongoose = require('mongoose')
const Schema = mongoose.Schema


const PageModel = new Schema({
  page_title: { type: String, trim: true, required: true },
  page_content: { type: String, trim: true, required: true },
  page_thumbnail: { type: Object },
  page_slug: { type: String, trim: true, required: true },
  page_date: { type: String, required: true },
  page_status: { type: String, required: true },
  page_template: { type: String },
  page_gallery: { type: Array },
  page_user_ref: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  collection: 'page'
})

PageModel.virtual('model_name').get(() => {
  return 'page'
})

PageModel.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('PageModel', PageModel)
