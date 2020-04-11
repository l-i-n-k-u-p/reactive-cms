import {
  Request,
  Model,
} from 'vue-mc'

import lib from '../lib/lib.vue'
import Socket from '../lib/socket.vue'


let io = new Socket.IO()


export default class BaseModel extends Model {
  constructor (props) {
    super(props)
    this.setCSRFToken()
    this.setupListeners()
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
  listenPushMessages (modelName = '') {
    if (modelName === '')
      return

    io.registerEvent(
      `${ window.user_client_id }-${ modelName }-put`,
      (data) => {
        if (this.get('id') !== data.data.id)
          return

        this.set(data.data)
        this.emit('notification', { method: 'put' })
      }
    )
    io.registerEvent(
      `${ window.user_client_id }-${ modelName }-delete`,
      (data) => {
        if (this.get('id') !== data.data.id)
          return

        this.removeFromAllCollections()
        this.emit('notification', { method: 'delete' })
      }
    )
  }
  listenPushGlobalMessages (modelName = '', event = '') {
    io.registerEvent(
      `${ modelName }-${ event }`,
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
  }
  off (eventName) {
    delete this._listeners[eventName]
  }
  getHeaders () {
    return {
      'Content-Type': 'application/json',
      'csrf-token': lib.getCookie('csrf-token'),
    }
  }
  getRequest (config) {
    return new Request(config)
  }
  onFetchSuccess (response) {
    // overriding - onFetchSuccess
    let attributes = response.getData().data
    this.assign(attributes)
  }
  options () {
    return {
      validateOnChange: true,
      validateRecursively: true,
      useFirstErrorOnly: true,
      saveUnchanged: false,
      isActiveRequest: false, // custom option
    }
  }
  _modelSave (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let data = this._attributes
    let config = {
      url,
      method,
      data,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onSave,
      this.onSaveSuccess,
      this.onSaveFailure,
    )
    return request
  }
  _modelDelete (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let data = this._attributes
    let config = {
      url,
      method,
      data,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onDelete,
      this.onDeleteSuccess,
      this.onDeleteFailure
    )
    return request
  }
  save (params) {
    return this._modelSave(
      'POST',
      'save',
      params,
    )
  }
  put (params) {
    return this._modelSave(
      'PUT',
      'put',
      params,
    )
  }
  delete (params) {
    return this._modelDelete(
      'DELETE',
      'delete',
      params,
    )
  }
}
