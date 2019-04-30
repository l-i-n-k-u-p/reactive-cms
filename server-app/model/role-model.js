const mongoose = require('mongoose')
const Schema = mongoose.Schema


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

module.exports = mongoose.model('RoleModel', RoleModel)
