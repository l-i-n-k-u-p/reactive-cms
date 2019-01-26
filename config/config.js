const APP_CONFIG = {
    port: 3000,
    mongoDBURI: 'mongodb://172.17.0.2:27017/reactivecms',
    bcryptSaltRounds: 12,
    appSecret: 'iCD5e@rx$3-9rR_QZwIW2Dg-Zn^h&heS', // 32 characters
    uploadDirectory: 'site-static/uploads/',
    sessionMaxAge: 10800000, // milliseconds
    ipAddressToListen: '0.0.0.0', // 0.0.0.0 for docker container
    domain: 'localhost', // localhost \ domain.com
    websiteTemplatesPath: './website/view/template/', // change only if edit the structure website directory
}


module.exports = APP_CONFIG
