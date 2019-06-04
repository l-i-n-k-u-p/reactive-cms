<script>
import {
  Model,
} from 'vue-mc'
import {
  length,
  string,
} from 'vue-mc/validation'

import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'
import lib from '../lib/lib'

let socketIO = new SocketIO()
let viewNameRegex = /[a-z\-]+/gi
let sapaceRegex = /\s/gi


class ViewModel extends Model {
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
      'view-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'view-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
  }
  defaults () {
    return {
      view_name: '',
      view_description: '',
    }
  }
  mutations() {
    return {
      view_name: String,
      view_description: String,
    }
  }
  validation() {
    return {
      view_name: (value) => {
        if (sapaceRegex.test(value))
          return "Not spaces only '-'"

        if (!viewNameRegex.test(value))
          return "Only letters"

        if (value.length < 2)
          return 'Must have a length of at least 2'
      },
      view_description: string.and(length(2, 150)),
    }
  }
  options () {
    return {
      validateOnChange: true,
      validateOnSave: true,
      validateRecursively: true,
      saveUnchanged: true,
      useFirstErrorOnly: true,
      hasNewVersionContent: false,
      initialPageContent: '',
    }
  }
  post () {
    let method = 'POST'
    let route = this.getRoute('post')
    let url = this.getURL(route, this.getRouteParameters())
    let data = this._attributes
    return this.getRequest({ method, url, data }).send()
  }
  put () {
    let method = 'PUT'
    let route = this.getRoute('put')
    let url = this.getURL(route, this.getRouteParameters())
    let data = this._attributes
    return this.getRequest({ method, url, data }).send()
  }
  delete () {
    let method = 'DELETE'
    let route = this.getRoute('delete')
    let url = this.getURL(route, this.getRouteParameters())
    let data = this._attributes
    return this.getRequest({ method, url, data }).send()
  }
  routes () {
    return {
      fetch: APP_SETTINGS.appApiBaseURL + '/view/{_id}',
      save: APP_SETTINGS.appApiBaseURL + '/view/',
      put: APP_SETTINGS.appApiBaseURL + '/view/{_id}',
      delete: APP_SETTINGS.appApiBaseURL + '/view/{_id}',
    }
  }
}

export default {
  model: ViewModel,
}

</script>
