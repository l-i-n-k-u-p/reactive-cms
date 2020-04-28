const mongoose = require('mongoose')
const dateTime = require('node-datetime')

const Schema = mongoose.Schema
const logQuery = require('../../query/log-query')


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

PageModel.post('findOneAndUpdate', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'update',
    log_operation_data: item,
    log_user_ref: item.page_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

PageModel.post('save', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'save',
    log_operation_data: item,
    log_user_ref: item.page_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

PageModel.post('findOneAndRemove', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'remove',
    log_operation_data: item,
    log_user_ref: item.page_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

module.exports = mongoose.model('PageModel', PageModel)
