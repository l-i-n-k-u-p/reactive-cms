<script>
import {
  Collection,
} from 'vue-mc'

import SocketIO from '../lib/socket-io'
import ViewModel from './view-model.vue'
import APP_SETTINGS from '../app-settings'

let socketIO = new SocketIO()


class ViewCollection extends Collection {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'view-post',
      (data) => {
        this.add(data.data)
        let lastModel = this.models.pop()
        this.models.unshift(lastModel)
      }
    )
  }
  model () {
    return ViewModel.model
  }
  getModelsFromResponse (response) {
    return response.getData().items
  }
  fetchAll (params) {
    let method = 'GET'
    let route = this.getRoute('fetchAll')
    let url = this.getURL(route, this.getRouteParameters())
    let data = params
    let request = this.getRequest({ method, url, data }).send()
    request.then(data => {
      for (let item of data.response.data.items)
        this.add(item)
    })
    return request
  }
  routes () {
    return {
      fetch: APP_SETTINGS.appApiBaseURL + '/views/{page}',
      fetchAll: APP_SETTINGS.appApiBaseURL + '/views-all/{page}',
    }
  }
}

export default {
  model: ViewCollection,
}

</script>
