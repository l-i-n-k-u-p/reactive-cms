const mongoose = require('mongoose')
const dateTime = require('node-datetime')

const Schema = mongoose.Schema
const logQuery = require('../log/query')


const MediaModel = new Schema({
  media_original_name: { type: String, trim: true, required: true },
  media_name: { type: String, trim: true, required: true },
  media_title: { type: String, trim: true, required: true },
  media_mime_type: { type: String, trim: true, required: true },
  media_size: { type: Number, trim: true, required: true },
  media_path: { type: String, trim: true, required: true },
  media_date: { type: String, trim: true, required: true },
  media_user_ref: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  collection: 'media'
})

MediaModel.virtual('model_name').get(() => {
  return 'media'
})

MediaModel.set('toJSON', {
  virtuals: true
})

MediaModel.post('findOneAndUpdate', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'update',
    log_operation_data: item,
    log_user_ref: item.media_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

MediaModel.post('save', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'save',
    log_operation_data: item,
    log_user_ref: item.media_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

MediaModel.post('findOneAndRemove', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'remove',
    log_operation_data: item,
    log_user_ref: item.media_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

module.exports = mongoose.model('MediaModel', MediaModel)
