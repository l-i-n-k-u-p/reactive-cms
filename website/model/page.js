const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Page = new Schema({
    page_title: { type: String, trim: true, required: true },
    page_content: { type: String, trim: true, required: true },
    page_thumbnail: { type: String, trim: true },
    page_slug: { type: String, trim: true, required: true },
    page_date: { type: String, required: true},
    page_status: { type: String, required: true },
    page_template: { type: String, },
}, {
    collection: 'page'
})

Page.virtual('model_name').get(() => {
    return 'page'
})

Page.set('toJSON', {
    virtuals: true
})


module.exports = mongoose.model('Page', Page)
