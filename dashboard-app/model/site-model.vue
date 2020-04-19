<script>
import {
  integer,
  length,
  string,
  min,
  url,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class SiteModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('site-settings')
  }
  defaults () {
    return {
      site_name: '',
      site_items_peer_page: '',
      site_url: '',
      site_template_home: '',
      site_template_posts: '',
      site_theme: '',
    }
  }
  mutations() {
    return {
      site_name: String,
      site_items_peer_page: Number,
      site_url: String,
    }
  }
  validation() {
    return {
      setting_page_title: string.and(length(2, 150)),
      site_name: string.and(length(2, 150)),
      site_items_peer_page: value => {
        if (value < 1 || value > 40) {
          return 'Must have a number between 1 and 40'
        }
      },
      site_url: url.and(length(2, 150)),
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/site/`,
      post: `${ APP_SETTINGS.appApiBaseURL }/site/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/site/`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/site/`,
    }
  }
}

export default {
  model: SiteModel,
}
</script>
