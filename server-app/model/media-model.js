const mongoose = require('mongoose')
const Schema = mongoose.Schema


const MediaModel = new Schema({
  media_original_name: { type: String, trim: true, required: true },
  media_name: { type: String, trim: true, required: true },
  media_title: { type: String, trim: true, required: true },
  media_mime_type: { type: String, trim: true, required: true },
  media_size: { type: Number, trim: true, required: true },
  media_path: { type: String, trim: true, required: true },
  media_date: { type: String, trim: true, required: true },
}, {
  collection: 'media'
})


MediaModel.virtual('model_name').get(() => {
  return 'media'
})

MediaModel.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('MediaModel', MediaModel)
