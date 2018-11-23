const mongoose = require('mongoose')
const Schema = mongoose.Schema


const User = new Schema({
    user_name: { type: String, trim: true, required: true, unique: true },
    user_pass: { type: String, required: true },
    user_email: { type: String, trim: true, required: true, unique: true },
    user_first_name: { type: String },
    user_last_name: { type: String },
    user_type: { type: String, required: true },
    user_registration_date: { type: String, required: true},
    user_active: { type: Boolean, required: true },
}, {
    collection: 'user'
})

User.virtual('model_name').get(function(){
  return 'user'
})

User.set('toJSON', {
   virtuals: true
})


module.exports = mongoose.model('User', User)
