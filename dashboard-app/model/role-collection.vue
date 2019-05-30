<script>
import {
  Collection,
} from 'vue-mc'

import SocketIO from '../lib/socket-io'
import RoleModel from './role-model.vue'
import APP_SETTINGS from '../app-settings'

let socketIO = new SocketIO()


class RoleCollection extends Collection {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'role-post',
      (data) => {
        this.add(data.data)
        let lastModel = this.models.pop()
        this.models.unshift(lastModel)
      }
    )
  }
  model () {
    return RoleModel.model
  }
  getModelsFromResponse (response) {
    return response.getData().items
  }
  bulkDelete (params) {
    let method = 'DELETE'
    let route = this.getRoute('bulkDelete')
    let url = this.getURL(route, this.getRouteParameters())
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  bulkUpdate (params) {
    let method = 'PUT'
    let route = this.getRoute('bulkUpdate')
    let url = this.getURL(route, this.getRouteParameters())
    // let data = this._attributes
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  routes () {
    return {
      fetch: APP_SETTINGS.appApiBaseURL + '/roles/{page}',
      bulkDelete: APP_SETTINGS.appApiBaseURL + '/roles/',
      bulkUpdate: APP_SETTINGS.appApiBaseURL + '/roles/',
    }
  }
}

export default {
  model: RoleCollection,
}

</script>
