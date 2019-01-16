const APP_CONFIG = {
    port: 3000,
    mongoDBURI: 'mongodb://172.17.0.2:27017/venom',
    bcryptSaltRounds: 12,
    appSecret: 'E5OReactiveWeb2018',
    uploadDirectory: 'site-static/uploads/',
    ignorePageSlug: [
        'dashboard',
        'blog',
        'example',
    ],
}


module.exports = APP_CONFIG
