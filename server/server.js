const fastify = require('fastify')({logger: false})
const fastifyStatic = require('fastify-static')
const fastifyFormBody = require('fastify-formbody')
const fastifyCookie = require('fastify-cookie')
const fastifyCaching = require('fastify-caching')
const fastifyServerSession = require('fastify-server-session')
const fastifyCors = require('fastify-cors')
const fastifyMultipart = require('fastify-multipart')
const fastifyURLData = require('fastify-url-data')
const fastifyHelmet = require('fastify-helmet')
const pointOfView = require('point-of-view')
const path = require('path')
const ejs = require('ejs')

const APP_CONFIG = require('../config/config')
const SITE_CONFIG = require('../config/site-config')
// const APP_GLOBAL = require('../config/global')
const mongodb = require('../db/mongodb')
const directory = require('../lib/directory')
const websiteRouter = require('../website/router/website-router')
const websiteDashboardAPIRouter = require('../website/router/website-dashboard-api-router')


// create static directory for uploads
directory.createFolderFromPath(APP_CONFIG.uploadDirectory)
// create static directory for upload image sizes
directory.createFolderFromPath(APP_CONFIG.uploadDirectory + 'sizes/')

// mongodb connect
const mongoDBInstance = mongodb.connect()

// body parse
fastify.register(fastifyFormBody)

// cors
fastify.register(fastifyCors, {
    origin: APP_CONFIG.domain,
})

// security headers
fastify.register(fastifyHelmet,{
    hidePoweredBy: {
        setTo: 'Reactive CMS',
    },
})

// session storage
fastify.register(fastifyCookie)
fastify.register(fastifyCaching)
fastify.register(fastifyServerSession, {
    secretKey: APP_CONFIG.appSecret,
    sessionMaxAge: APP_CONFIG.sessionMaxAge,
    cookie: {
        domain: APP_CONFIG.domain,
    },
})

// template engine
fastify.register(pointOfView, {
    engine: {
        ejs: ejs,
    },
    options: {
        filename: path.resolve('website/view'),
    },
    templates: 'website/view',
    includeViewExtension: true,
})

// static directory
fastify.register((instance, opts, next) => {
    instance.register(fastifyStatic, {
        root: path.join(__dirname, '../website/static'),
        prefix: '/website',
    })
    next()
})

// static directory
fastify.register((instance, opts, next) => {
    instance.register(fastifyStatic, {
        root: path.join(__dirname, '../site-static'),
        prefix: '/public',
    })
    next()
})

// multipart data for upload files
fastify.register(fastifyMultipart)

// support for getting raw URL information from the request
fastify.register(fastifyURLData)

// router website
fastify.register(websiteRouter)

// router website dashboard api
fastify.register(websiteDashboardAPIRouter, { prefix: '/dashboard/api/v1/' })

// 500 global handler
fastify.setErrorHandler((err, req, res) => {
    req.log.warn(err)
    let statusCode = err.statusCode >= 400 ? err.statusCode : 500
    res.code(statusCode).view('500', {
        title: SITE_CONFIG.siteTitle,
        status: 'Server error!',
        error_message: statusCode >= 500 ? 'Internal server error' : error.message,
    })
})

// 404 global handler
fastify.setNotFoundHandler((req, res) => {
    const urlData = req.urlData()
    res.code(404).view('404', {
        title: SITE_CONFIG.siteTitle,
        status: 'Page not found',
        error_message: 'Route: '+urlData.path+' Not found.',
    })
})

// listener
fastify.listen(APP_CONFIG.port, APP_CONFIG.ipAddressToListen, (err, address) => {
    if(err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info('Server listening on port: ',address)
})

// TODO: finish session stored
