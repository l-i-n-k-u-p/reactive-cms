const APP_GLOBAL = require('../config/global')
const modelSetting = require('../website/model/setting')


const loadDashboardSettings = async () => {
    let settings = await modelSetting.findOne()
    if(!settings)
        return

    DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST = settings.setting_items_peer_page
    DASHBOARD_ADMIN_CONFIG.dashboardTitle = settings.setting_page_title
    DASHBOARD_ADMIN_CONFIG.setupPassed = true
}

const DASHBOARD_ADMIN_CONFIG = {
    MAX_PAGES_BY_REQUEST: 20,
    IMAGE_SIZES: [
            [600, 200],
            [150, 150],
        ],
    dashboardTitle: 'Reactive CMS',
    setupPassed: false,
    loadDashboardSettings,
}

DASHBOARD_ADMIN_CONFIG.loadDashboardSettings()


module.exports = DASHBOARD_ADMIN_CONFIG
