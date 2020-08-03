const APP_CONFIG = {
  port: 80,
  mongoDBURI: process.env.RCMS_MONGODB_URI,
  bcryptSaltRounds: 12,
  appSecret: 'iCD5e@rx$3-9rR_QZwIW2Dg-Zn^h&heS', // 32 characters
  staticUploadPath: 'site-static',
  staticUploadPrefix: 'public', // use '/public/' instead of '/site-static/'
  uploadDirectory: 'site-static/uploads/',
  staticFilesPath: 'static',
  staticFilesPrefix: 'website',
  sessionMaxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
  ipAddressToListen: process.env.RCMS_HOST_IP, // 0.0.0.0 for docker container
  domain: process.env.RCMS_DOMAIN, // localhost \ ip address \ domain.com
  fastifyOptions: {
    http2: false,
    https: null,
    ignoreTrailingSlash: true,
    logger: ((process.env.RCMS_LOGS === '0')?false:true),
  },
  socketIOOptions: {
    socketIOpingTimeout: 60000,
    pingInterval: 10000,
    pingTimeout: 5000,
  },
  emailOptions: {
    emailService: process.env.RCMS_EMAIL_SERVICE,
    emailAccount: process.env.RCMS_EMAIL_ACCOUNT,
    emailAccountPassword: process.env.RCMS_EMAIL_PASSWORD,
  },
}

module.exports = APP_CONFIG
