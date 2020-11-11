import {
  Request,
  Model,
} from 'vue-mc'

import lib from '../../lib/lib.js'
import Socket from '../../lib/socket-io.vue'


let io = new Socket.IO()


export default class BaseModel extends Model {
  constructor (props) {
    super(props)
  }
  listenPushMessages (modelName = '') {
    if (modelName === '')
      return

    io.registerEvent(
      `${ modelName }-put`,
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) !== data.data[identifier])
          return

        this.set(data.data) // TODO: ask for update
        this.emit('notification', { method: 'put' })
      }
    )
    io.registerEvent(
      `${ modelName }-delete`,
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) !== data.data[identifier])
          return

        this.removeFromAllCollections()
        this.emit('notification', { method: 'delete' })
      }
    )
  }
  listenPushGlobalMessages (modelName = '', event = '') {
    io.registerEvent(
      `${ modelName }-${ event }`,
      data => {
        let identifier = this.getOption('identifier')
        if (this.get(identifier) === data.data[identifier])
          this.set(data.data)
      }
    )
  }
  off (eventName) {
    delete this._listeners[eventName]
  }
  getHeaders () {
    return Vue.axios.defaults.headers.common
  }
  getRequest (config) {
    return new Request(config)
  }
  onFetchSuccess (response) {
    let keyData = this.getOption('responseKeyData')
    let attributes = response.getData()
    if (keyData !== '')
      attributes = attributes[keyData]
    if (Vue.prototype._.isEmpty(attributes))
      throw this.createResponseError('No data in fetch response', response)
    this.assign(attributes)
    Vue.set(this, 'fatal',   false)
    Vue.set(this, 'loading', false)
    this.emit('fetch', { error: null })
  }
  onSaveSuccess (response) {
    let action
    this.clearErrors()
    if (response) {
      let keyData = this.getOption('responseKeyData')
      let responseData = response.getData()
      if (keyData !== '')
        responseData = responseData[keyData]
      action = 'update'
      if (response.getStatus() === 201 ||
          ( !this.saved('id') && (Vue.prototype._.isPlainObject(responseData) && Vue.prototype._.get(responseData, 'id'))))
          action = 'create'
      this.update(responseData)
    }
    Vue.set(this, 'saving', false)
    Vue.set(this, 'fatal',  false)
    this.emit('save.success', { error: null })
    if (action)
      this.emit(action, { error: null })
  }
  options () {
    return {
      identifier: '_id',
      validateOnChange: true,
      validateRecursively: true,
      useFirstErrorOnly: true,
      saveUnchanged: false,
      isActiveRequest: false, // custom option
      responseKeyData: 'data', // custom option
    }
  }
  _modelFetch (methodName, routeName, params) {
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
      this.onFetch,
      this.onFetchSuccess,
      this.onFetchFailure
    )
    return request
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
