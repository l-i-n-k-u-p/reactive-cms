<script>
import {
  Collection,
} from 'vue-mc'

import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'

let socketIO = new SocketIO()


class DashboardCollection extends Collection {
  getModelsFromResponse (response) {
    return response.getData().items
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/dashboard/`,
    }
  }
}

export default {
  model: DashboardCollection,
}

</script>
