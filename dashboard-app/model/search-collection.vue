<script>
import {
  Collection,
} from 'vue-mc'

import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'

let socketIO = new SocketIO()


class SearchCollection extends Collection {
  getModelsFromResponse (response) {
    return response.getData().items
  }
  routes () {
    return {
      fetch: APP_SETTINGS.appApiBaseURL + '/search/',
    }
  }
}

export default {
  model: SearchCollection,
}

</script>
