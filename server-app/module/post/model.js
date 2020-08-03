const mongoose = require('mongoose')
const dateTime = require('node-datetime')

const Schema = mongoose.Schema
const logQuery = require('../log/query')


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

PostModel.post('findOneAndUpdate', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'update',
    log_operation_data: item,
    log_user_ref: item.post_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

PostModel.post('save', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'save',
    log_operation_data: item,
    log_user_ref: item.post_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

PostModel.post('findOneAndRemove', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'remove',
    log_operation_data: item,
    log_user_ref: item.post_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

module.exports = mongoose.model('PostModel', PostModel)
