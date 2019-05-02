const mongoose = require('mongoose')
const Schema = mongoose.Schema


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
}, {
  collection: 'user'
})

UserModel.virtual('model_name').get(() => {
  return 'user'
})

UserModel.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('UserModel', UserModel)
