<script>
import {
  Model,
} from 'vue-mc'
import {
  integer,
  length,
  string,
  min,
  url,
} from 'vue-mc/validation'

import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'
import lib from '../lib/lib'

let socketIO = new SocketIO()


class SiteModel extends Model {
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
      'site-settings-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'site-settings-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
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
      site_items_peer_page: (value) => {
        if (value < 1 || value > 40) {
          return 'Must have a number between 1 and 40'
        }
      },
      site_url: url.and(length(2, 150)),
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
