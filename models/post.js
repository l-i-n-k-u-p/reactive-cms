const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Post = new Schema({
    post_title: { type: String, trim: true, required: true },
    post_content: { type: String, trim: true, required: true },
    post_thumbnail: { type: mongoose.Schema.Types.ObjectId },
    post_slug: { type: String, trim: true, required: true },
    post_date: { type: String, required: true},
    post_status: { type: String, required: true },
}, {
    collection: 'post'
})

Post.virtual('model_name').get(function(){
  return 'post'
})

Post.set('toJSON', {
   virtuals: true
})


module.exports = mongoose.model('Post', Post)
