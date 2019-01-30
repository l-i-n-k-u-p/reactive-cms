const mongoose = require('mongoose')
const APP_CONFIG = require('../../config/config')
const Schema = mongoose.Schema


const Session = new Schema({
    _id: { type: String },
    session: { type: Object },
    expires: { type: Date },
}, {
    collection: 'session'
})

module.exports = mongoose.model('Session', Session)
