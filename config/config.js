const APP_CONFIG = {
    port: 3000,
    mongoDBURI: 'mongodb://172.17.0.2:27017/forcesetup',
    bcryptSaltRounds: 12,
    appSecret: 'iCD5e@rx$3-9rR_QZwIW2Dg-Zn^h&heS', // 32 characters
    uploadDirectory: 'site-static/uploads/',
    sessionMaxAge: 10800000,
}


module.exports = APP_CONFIG
