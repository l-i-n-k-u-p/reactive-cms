<script>
import {
  integer,
  length,
  string,
  min,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class SettingModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('settings')
  }
  defaults () {
    return {
      setting_page_title: '',
      setting_items_peer_page: '',
    }
  }
  mutations() {
    return {
      setting_page_title: String,
      setting_items_peer_page: Number,
    }
  }
  validation() {
    return {
      setting_page_title: string.and(length(2, 150)),
      setting_items_peer_page: value => {
        if (value < 1 || value > 40) {
          return 'Must have a number between 1 and 40'
        }
      },
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/setting/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/setting/`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/setting/`,
    }
  }
}

export default {
  model: SettingModel,
}

</script>
