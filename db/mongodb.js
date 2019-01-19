const APP_CONFIG = require('../config/config')
const APP_GLOBAL = require('../config/global')
const mongoose = require('mongoose')


const connect = async () => {
    try {
        let mongooseConnection = await mongoose.connect(APP_CONFIG.mongoDBURI, {
            promiseLibrary: global.Promise,
            useNewUrlParser: true
        })
        return mongooseConnection.connection
    } catch(err) {
        return err
    }
}


module.exports = {
    connect: connect
}
