const APP_CONFIG = {
  port: 80,
  mongoDBURI: 'mongodb://192.168.3.4:27017/reactivecms',
  bcryptSaltRounds: 12,
  appSecret: 'iCD5e@rx$3-9rR_QZwIW2Dg-Zn^h&heS', // 32 characters
  staticUploadPath: 'site-static',
  staticUploadPrefix: 'public', // use '/public/' instead of '/site-static/'
  uploadDirectory: 'site-static/uploads/',
  staticFilesPath: 'static',
  staticFilesPrefix: 'website',
  sessionMaxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
  ipAddressToListen: '0.0.0.0', // 0.0.0.0 for docker container
  domain: 'localhost', // localhost \ ip address \ domain.com
  fastifyOptions: {
    http2: false,
    https: null,
    ignoreTrailingSlash: true,
    logger: false,
  },
  socketIOOptions: {
    socketIOpingTimeout: 60000,
    pingInterval: 10000,
    pingTimeout: 5000,
  },
  emailOptions: {
    emailService: 'gmail',
    emailAccount: '',
    emailAccountPassword: '',
  },
}

module.exports = APP_CONFIG
