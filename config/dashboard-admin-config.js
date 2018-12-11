const path = require('path')

const APP_GLOBAL = require('../config/global.js')
const modelSetting = require(path.join(APP_GLOBAL.appServerPath, '../models/setting'))


const loadDashboardSettings = async () => {
    let settings = await modelSetting.findOne()
    DASBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST = settings.setting_items_peer_page
}

const DASBOARD_ADMIN_CONFIG = {
    MAX_PAGES_BY_REQUEST: 20,
    IMAGE_SIZES: [
            [600, 200],
            [150, 150],
        ],
    loadDashboardSettings,
}

DASBOARD_ADMIN_CONFIG.loadDashboardSettings()


module.exports = DASBOARD_ADMIN_CONFIG
