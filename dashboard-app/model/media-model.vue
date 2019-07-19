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


class MediaModel extends Model {
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
      'media-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'media-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
  }
  defaults () {
    return {
      media_original_name: '',
      media_name: '',
      media_title: '',
      media_mime_type: '',
      media_size: '',
      media_path: '',
      media_date: '',
    }
  }
  mutations() {
    return {
      media_title: String,
    }
  }
  validation() {
    return {
      media_title: string.and(length(2, 150)),
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
      fetch: `${ APP_SETTINGS.appApiBaseURL }/media-file/{_id}`,
      save: `${ APP_SETTINGS.appApiBaseURL }/media-file/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/media-file/{_id}`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/media-file/{_id}`,
    }
  }
  isImage () {
    let mimetype = this.get('media_mime_type')
    if (mimetype === 'image/jpeg' || mimetype === 'image/png')
    return true

    return false
  }
  getMediaURL () {
    return '/public/uploads/' + this.get('media_name')
  }
}


export default {
  model: MediaModel,
}

</script>
