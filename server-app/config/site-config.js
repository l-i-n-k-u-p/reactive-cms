const SiteModel = require('../model/site-model')


const loadSiteSettings = async () => {
  let settings = await SiteModel.findOne()
  if (!settings)
    return

  SITE_CONFIG.siteTitle = settings.site_name
  SITE_CONFIG.siteItemsPeerPage = settings.site_items_peer_page
  SITE_CONFIG.siteTemplateHome = settings.site_template_home
  SITE_CONFIG.siteTemplatePosts = settings.site_template_posts
  if (settings.site_theme)
    SITE_CONFIG.siteTheme = settings.site_theme
}

const SITE_CONFIG = {
  siteTitle: 'Reactive Web',
  siteItemsPeerPage: 12,
  siteTemplateHome: '',
  siteTemplatePosts: '',
  siteTheme: 'theme-default',
  loadSiteSettings,
}

SITE_CONFIG.loadSiteSettings()

module.exports = SITE_CONFIG
