const mongoose = require('mongoose')
const dateTime = require('node-datetime')

const Schema = mongoose.Schema
const logQuery = require('../query/log-query')


const UserModel = new Schema({
  user_name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  user_pass: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  user_first_name: {
    type: String,
  },
  user_last_name: {
    type: String,
  },
  user_registration_date: {
    type: String,
    required: true,
  },
  user_active: {
    type: Boolean,
    required: true,
  },
  user_thumbnail: {
    type: Object,
  },
  user_avatar: {
    type: Object,
  },
  user_role_ref: {
    type: Schema.Types.ObjectId,
    ref: 'role',
    required: true,
  },
  user_user_ref: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  user_locale: {
    type: String,
    required: true,
    default: 'en',
  },
}, {
  collection: 'user'
})

UserModel.virtual('model_name').get(() => {
  return 'user'
})

UserModel.set('toJSON', {
  virtuals: true
})

UserModel.post('findOneAndUpdate', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'update',
    log_operation_data: item,
    log_user_ref: item.user_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

UserModel.post('save', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'save',
    log_operation_data: item,
    log_user_ref: item.user_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

UserModel.post('findOneAndRemove', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'remove',
    log_operation_data: item,
    log_user_ref: item.user_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

module.exports = mongoose.model('UserModel', UserModel)
