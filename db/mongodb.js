const APP_CONFIG = require('../config/config.js')
const APP_GLOBAL = require('../config/global.js')
const mongoose = require('mongoose')



var connect = () => {
    mongoose.connect(APP_CONFIG.mongoDBURI, {
        promiseLibrary: global.Promise,
        useNewUrlParser: true
    })
    .then( () => {
        console.log(APP_GLOBAL.logAppName, 'db connected!')
        return mongoose.connection
    })
    .catch( err => {
        console.log(APP_GLOBAL.logAppName, 'db conexion error!', err)
        return err
    })
    return mongoose.connection
}


module.exports = {
    connect: connect
}
