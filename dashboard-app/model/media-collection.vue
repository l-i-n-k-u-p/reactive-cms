<script>
import {
  Collection,
} from 'vue-mc'
import SocketIO from '../lib/socket-io'
import MediaModel from './media-model.vue'
import APP_SETTINGS from '../app-settings'


let socketIO = new SocketIO()

class MediaCollection extends Collection {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'media-post',
      (data) => {
        this.add(data.data)
        let lastModel = this.models.pop()
        this.models.unshift(lastModel)
      }
    )
  }
  model () {
    return MediaModel.model
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
      fetch: APP_SETTINGS.appApiBaseURL + '/media-files/{page}',
      bulkDelete: APP_SETTINGS.appApiBaseURL + '/media-files/',
      bulkUpdate: APP_SETTINGS.appApiBaseURL + '/media-files/',
    }
  }
}

export default {
  model: MediaCollection,
}

</script>
