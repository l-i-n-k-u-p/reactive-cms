const APP_CONFIG = require('../config/config.js')
const APP_GLOBAL = require('../config/global.js')
const mongoose = require('mongoose')


var connect = async () => {
    try {
        let mongooseConnection = await mongoose.connect(APP_CONFIG.mongoDBURI, {
            promiseLibrary: global.Promise,
            useNewUrlParser: true
        })
        console.log(APP_GLOBAL.logAppName, 'db connected!')
        return mongooseConnection.connection
    } catch(err) {
        console.log(APP_GLOBAL.logAppName, 'db conexion error!', err)
        return err
    }
}


module.exports = {
    connect: connect
}
