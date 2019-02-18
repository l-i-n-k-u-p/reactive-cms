const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Session = new Schema({
  _id: { type: String },
  session: { type: Object },
  expires: { type: Date },
}, {
  collection: 'session'
})

module.exports = mongoose.model('Session', Session)
