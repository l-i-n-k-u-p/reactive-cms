const mongoose = require('mongoose')
const APP_CONFIG = require('../../config/config')
const Schema = mongoose.Schema


const Session = new Schema({
    _id: { type: String },
    createdAt: { type: Date, expires: APP_CONFIG.sessionMaxAge },
    session_user: { type: Object },
}, {
    collection: 'sessions'
})

module.exports = mongoose.model('Session', Session)
