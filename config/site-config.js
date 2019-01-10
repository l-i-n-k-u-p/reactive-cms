const path = require('path')

const APP_GLOBAL = require('../config/global.js')
const modelSite = require(path.join(APP_GLOBAL.appServerPath, '../models/site'))


const loadSiteSettings = async () => {
    let settings = await modelSite.findOne()
    if(!settings)
        return

    SITE_CONFIG.siteTitle = settings.site_name
    SITE_CONFIG.siteItemsPeerPage = settings.site_items_peer_page
}

const SITE_CONFIG = {
    siteTitle: 'Reactive CMS',
    siteItemsPeerPage: 12,
    loadSiteSettings,
}

SITE_CONFIG.loadSiteSettings()


module.exports = SITE_CONFIG
