const fastify = require('fastify')({ logger: false })
const fastifyStatic = require('fastify-static')
const fastifyFormBody = require('fastify-formbody')
const fastifySession = require('fastify-session')
const fastifyCookie = require('fastify-cookie')
const MongoDBStore = require('connect-mongodb-session')(fastifySession)
const fastifyCors = require('fastify-cors')
const fastifyMultipart = require('fastify-multipart')
const fastifyURLData = require('fastify-url-data')
const fastifyHelmet = require('fastify-helmet')
const pointOfView = require('point-of-view')
const path = require('path')
const ejs = require('ejs')
const io = require('socket.io')(fastify.server)

const APP_CONFIG = require('../config/config')
const SITE_CONFIG = require('../config/site-config')
const mongodb = require('../db/mongodb')
const directory = require('../lib/directory')
const websiteRouter = require('../website/router/website-router')
const websiteDashboardAPIRouter = require('../website/router/website-dashboard-api-router')
const SocketIO = require('../lib/socket-io')


// create static directory for uploads
directory.createFolderFromPath(APP_CONFIG.uploadDirectory)
// create static directory for upload image sizes
directory.createFolderFromPath(APP_CONFIG.uploadDirectory + 'sizes/')
// get template file names
directory.generateTemplateFileNames(APP_CONFIG.websiteTemplatesPath)

// mongodb connect
mongodb.connect()

// body parse
fastify.register(fastifyFormBody)

// cors
fastify.register(fastifyCors, {
  origin: APP_CONFIG.domain,
})

// security headers
fastify.register(fastifyHelmet, {
  hidePoweredBy: {
    setTo: 'Reactive CMS',
  },
})

// session store
let mongoDBSessionStore = new MongoDBStore({
  uri: APP_CONFIG.mongoDBURI,
  collection: 'session',
})
fastify.register(fastifyCookie)
fastify.register(fastifySession, {
  secret: APP_CONFIG.appSecret,
  cookie: {
    maxAge: APP_CONFIG.sessionMaxAge,
    expires: APP_CONFIG.sessionMaxAge,
    domain: APP_CONFIG.domain,
    secure: false,
  },
  store: mongoDBSessionStore,
  saveUninitialized: true,
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
    root: path.join(__dirname, '../' + APP_CONFIG.staticFilesPath),
    prefix: APP_CONFIG.staticFilesPrefix,
  })
  next()
})

// static directory
fastify.register((instance, opts, next) => {
  instance.register(fastifyStatic, {
    root: path.join(__dirname, '../' + APP_CONFIG.staticUploadPath),
    prefix: APP_CONFIG.staticUploadPrefix,
  })
  next()
})

// socket.io instance
const socketIO = new SocketIO(io)
fastify.decorateRequest('pushBroadcastMessage', (data) => {
  socketIO.pushBroadcastMessage(data)
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
    error_message: statusCode >= 500 ? 'Internal server error' : err.message,
  })
})

// 404 global handler
fastify.setNotFoundHandler((req, res) => {
  const urlData = req.urlData()
  res.code(404).view('404', {
    title: SITE_CONFIG.siteTitle,
    status: 'Page not found',
    error_message: 'Route: ' + urlData.path + ' Not found.',
  })
})

// listener
fastify.listen(APP_CONFIG.port, APP_CONFIG.ipAddressToListen, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info('Server listening on port: ', address)
})

// TODO: finish session stored
