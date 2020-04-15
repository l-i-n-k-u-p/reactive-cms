import {
  Request,
  Collection,
} from 'vue-mc'

import lib from '../../lib/lib.js'
import Socket from '../../lib/socket-io.vue'


let io = new Socket.IO()


export default class BaseCollection extends Collection {
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
      `${ modelName }-post`,
      data => {
        this.add(data.data)
        let lastModel = this.models.pop()
        this.models.unshift(lastModel)
        this.emit('notification', { method: 'post' })
      }
    )
    io.registerEvent(
    `${ modelName }-put`,
      data => {
        this.emit('notification', { method: 'put' })
      }
    )
    io.registerEvent(
      `${ modelName }-delete`,
      data => {
        this.emit('notification', {method: 'delete'})
      }
    )
  }
  listenPushGlobalMessages (modelName = '', event = '') {
    io.registerEvent(
      `${ modelName }-${ event }`,
      data => {
        this.emit('notification', { method: event })
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
  getChangedModels () {
    return this.filter((model) => {
      if (model.changed().length > 1)
        return true

      return false
    })
  }
  getModelsFromResponse (response) {
    return response.getData().items
  }
  _collectionFetch (methodName, routeName, params) {
    let method = methodName
    let route = this.getRoute(routeName)
    let url = this.getURL(route, this.getRouteParameters())
    let header = this.getHeaders()
    let config = {
      url,
      method,
      params,
      header,
    }
    let request = this.request(
      config,
      this.onFetch,
      this.onFetchSuccess,
      this.onFetchFailure,
    )
    return request
  }
  fetchAll (params) {
    return this._collectionFetch(
      'GET',
      'fetchAll',
      params,
    )
  }
}
