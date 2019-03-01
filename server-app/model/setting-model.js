const mongoose = require('mongoose')
const Schema = mongoose.Schema


const SettingModel = new Schema({
  setting_page_title: { type: String, required: true },
  setting_items_peer_page: { type: Number, required: true },
}, {
  collection: 'setting'
})

SettingModel.virtual('model_name').get(() => {
  return 'setting'
})

SettingModel.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('SettingModel', SettingModel)
