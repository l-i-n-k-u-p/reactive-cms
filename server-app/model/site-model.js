const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SiteModel = new Schema({
  site_name: { type: String, required: true },
  site_items_peer_page: { type: Number, required: true },
  site_url: { type: String, required: true },
  site_template_home: { type: String },
  site_template_posts: { type: String },
}, {
  collection: 'site'
})

SiteModel.virtual('model_name').get(() => {
  return 'site'
})

SiteModel.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('SiteModel', SiteModel)
