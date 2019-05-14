<script>
import {
  Model,
  Collection,
} from 'vue-mc'
import SocketIO from '../lib/socket-io'
import ViewModel from './view-model.vue'
import APP_SETTINGS from '../app-settings'


let socketIO = new SocketIO()

class ViewListModel extends Collection {
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
  routes () {
    return {
      fetch: APP_SETTINGS.appApiBaseURL + '/views/{page}',
    }
  }
}

export default {
  model: ViewListModel,
}

</script>
