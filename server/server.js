const mongodb = require('../db/mongodb')
const path = require('path')
const fastify = require('fastify')({logger: true})
const pointOfView = require('point-of-view')
const fastifyStatic = require('fastify-static')
const fastifyFormBody = require('fastify-formbody')
const fastifyCookie = require('fastify-cookie')
const fastifyCaching = require('fastify-caching')
const fastifyServerSession = require('fastify-server-session')
const fastifyCors = require('fastify-cors')
const resolve = require('path').resolve
const ejs = require('ejs')

const APP_CONFIG = require('../config/config')
const APP_GLOBAL = require('../config/global')
const websiteRouter = require('../website/router/website-router')
const websiteDashboardAPIRouter = require('../website/router/website-dashboard-api-router')
const directory = require('../lib/directory')


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
    origin: true,
})

// session storage
fastify.register(fastifyCookie)
fastify.register(fastifyCaching)
fastify.register(fastifyServerSession, {
    secretKey: APP_CONFIG.appSecret,
    sessionMaxAge: APP_CONFIG.sessionMaxAge,
    cookie: {
        domain: 'localhost',
    },
})

// template engine
fastify.register(pointOfView, {
    engine: {
        ejs: ejs,
    },
    options: {
        filename: resolve('website/view'),
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

// router website
fastify.register(websiteRouter)

// router website dashboard api
fastify.register(websiteDashboardAPIRouter, { prefix: '/dashboard/api' })

// listener
fastify.listen(APP_CONFIG.port, '0.0.0.0', (err, address) => {
    if(err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info('server listening on port: ',address)
})

// TODO: finish session stored
