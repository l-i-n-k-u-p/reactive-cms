const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Setting = new Schema({
  setting_page_title: { type: String, required: true },
  setting_items_peer_page: { type: Number, required: true },
}, {
  collection: 'setting'
})

Setting.virtual('model_name').get(() => {
  return 'setting'
})

Setting.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('Setting', Setting)
