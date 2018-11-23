const path = require('path')


const APP_GLOBAL = {
    appServerPath: path.dirname(require.main.filename),
    logAppName: '\n\n=========== VENV ===========\n',
    logWebsiteAppName: '\n\n=========== WENSITE ===========\n',
    logClientAppName: '\n\n=========== CLIENT ===========\n',
    logSellerAppName: '\n\n=========== SELLER ===========\n',
    websiteName: 'WEBSITE',
}


module.exports = APP_GLOBAL
