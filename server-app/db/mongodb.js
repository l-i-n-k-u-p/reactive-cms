const mongoose = require('mongoose')

const APP_CONFIG = require('../config/config')


const connect = async () => {
  try {
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
    let mongooseConnection = await mongoose.connect(APP_CONFIG.mongoDBURI, {
      promiseLibrary: global.Promise,
      useNewUrlParser: true
    })
    return mongooseConnection.connection
  } catch (err) {
    return err
  }
}

module.exports = {
  connect: connect
}
