const mongoose = require('mongoose')
const dateTime = require('node-datetime')

const Schema = mongoose.Schema
const logQuery = require('../../query/log-query')


const RoleModel = new Schema({
  role_name: {
    type: String,
    trim: true,
    required: true,
  },
  role_user_ref: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  collection: 'role'
})

RoleModel.index({
  'role_name': true,
  'role_user_ref': true,
},
{
  'unique': true,
})

RoleModel.virtual('model_name').get(() => {
  return 'role'
})

RoleModel.set('toJSON', {
  virtuals: true
})

RoleModel.post('findOneAndUpdate', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'update',
    log_operation_data: item,
    log_user_ref: item.role_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

RoleModel.post('save', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'save',
    log_operation_data: item,
    log_user_ref: item.role_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

RoleModel.post('findOneAndRemove', (item) => {
  let log = logQuery.create({
    log_model: item.model_name,
    log_operation: 'remove',
    log_operation_data: item,
    log_user_ref: item.role_user_ref,
    log_date: dateTime.create().format('Y-m-d H:M:S'),
  })
})

module.exports = mongoose.model('RoleModel', RoleModel)
