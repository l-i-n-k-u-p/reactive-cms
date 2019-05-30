<script>
import {
  Model,
} from 'vue-mc'
import {
  length,
  string,
  email,
} from 'vue-mc/validation'

import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'
import lib from '../lib/lib'

let socketIO = new SocketIO()


class ProfileModel extends Model {
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
      'user-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'user-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
  }
  defaults () {
    return {
      user_name: '',
      user_email: '',
      user_first_name: '',
      user_last_name: '',
      user_registration_date: '',
      user_active: '',
      user_thumbnail: '',
      user_avatar: '',
      user_role_ref: '',
      user_role: '',
      user_resource: '',
    }
  }
  mutations() {
    return {
      user_name: String,
      user_email: String,
      user_first_name: String,
    }
  }
  validation() {
    return {
      user_name: string.and(length(2, 100)),
      user_pass: string.and(length(2, 100)),
      user_email: email,
      user_first_name: string.and(length(2, 100)),
    }
  }
  options () {
    return {
      validateOnChange: true,
      validateOnSave: true,
      validateRecursively: true,
      saveUnchanged: true,
      useFirstErrorOnly: true,
    }
  }
  put () {
    let method = 'PUT'
    let route = this.getRoute('put')
    let url = this.getURL(route, this.getRouteParameters())
    let data = this._attributes
    return this.getRequest({ method, url, data }).send()
  }
  routes () {
    return {
      fetch: APP_SETTINGS.appApiBaseURL + '/profile/{_id}',
      put: APP_SETTINGS.appApiBaseURL + '/profile/{_id}',
    }
  }
}

export default {
  model: ProfileModel,
}

</script>
