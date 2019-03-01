const mongoose = require('mongoose')
const Schema = mongoose.Schema


const SessionModel = new Schema({
  _id: { type: String },
  session: { type: Object },
  expires: { type: Date },
}, {
  collection: 'session'
})

module.exports = mongoose.model('SessionModel', SessionModel)
