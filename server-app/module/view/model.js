const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ViewModel = new Schema({
  view_name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  view_description: {
    type: String,
    trim: true,
  },
}, {
  collection: 'view'
})

ViewModel.virtual('model_name').get(() => {
  return 'view'
})

ViewModel.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('ViewModel', ViewModel)
