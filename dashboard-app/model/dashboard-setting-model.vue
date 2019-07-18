<script>
import {
  Model,
} from 'vue-mc'

import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'
import lib from '../lib/lib'

let socketIO = new SocketIO()


class DashboardSettingModel extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
    this.setupListeners()
    this.setCSRFToken()
  }
  setCSRFToken () {
    let csrf = lib.getCookie('csrf-token')
    this.set('_csrf', csrf)
  }
  setupListeners () {
    this.on('fetch', (event) => {
      this.setCSRFToken()
    })
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'settings-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'settings-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
  }
  defaults () {
    return {
      setting_page_title: '',
      setting_items_peer_page: '',
    }
  }
  options () {
    return {}
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/dashboard-settings/`,
    }
  }
}

export default {
  model: DashboardSettingModel,
}

</script>
