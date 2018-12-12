const mongodb = require('../db/mongodb')
const path = require('path')
const express = require('express')
const expressSession = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const ejs = require('ejs')
const assert = require('assert')
const MongoDBStore = require('connect-mongodb-session')(expressSession)
const app = express()

const APP_CONFIG = require('../config/config')
const APP_GLOBAL = require('../config/global')
const websiteAppRouter = require('../website-app/routes/website-router')
const websiteAppApiRouter = require('../website-app/routes/api-router')
const clientAppRouter = require('../client-app/routes/router')


// settings
app.set('port', process.env.PORT || APP_CONFIG.port)
app.set('views', [
    path.join(__dirname, '../website-app/templates'),
    path.join(__dirname, '../client-app/templates'),
])
app.engine('html', ejs.renderFile)
// app.set('view engine', 'ejs')


// middlewares
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))
app.use(bodyParser.json())
app.use(cors())


// mongodb connect
const mongoDBInstance = mongodb.connect()

let store = new MongoDBStore({
    uri: APP_CONFIG.mongoDBURI,
})
store.on('connected', () => {
    store.client // The underlying MongoClient object from the MongoDB driver
})
store.on('error', (error) => {
    // assert.ifError(error)
    console.log(APP_GLOBAL.logAppName, 'Store Error: ', error)
    assert.ok(false)
})
app.use(expressSession({
    secret: APP_CONFIG.appSecret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days
    },
    resave: false,
    saveUninitialized: false,
    store: store,
}))


// index routers
app.use('/', websiteAppRouter)
app.use('/admin-website/api', websiteAppApiRouter)
app.use('/client-dashboard', clientAppRouter)


// static files
app.use(express.static(path.join(__dirname, '../site-static')))
app.use(express.static(path.join(__dirname, '../website-app/static')))
app.use(express.static(path.join(__dirname, '../client-app/static')))


// handler for 500 and 404 pages
app.use((req, res, next) => {
    res.status(404).render('404.html', {title: APP_GLOBAL.websiteName, status: 'Page not found!', error_message: 'Route: '+req.url+' Not found.'})
})

app.use(function(err, req, res, next) {
    res.status(500).render('500.html', {title: APP_GLOBAL.websiteName, status: 'Error 500!', error_message: err})
})


// server listener
app.listen(app.get('port'), () => {
    console.log(APP_GLOBAL.logAppName, 'Running on port '+APP_CONFIG.port)
})


// mongod --bind_ip_all
