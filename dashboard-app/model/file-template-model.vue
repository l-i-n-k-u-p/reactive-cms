<script>
import {
  Model,
  Collection,
} from 'vue-mc'
import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'


let socketIO = new SocketIO()

class FileTemplateModel extends Collection {
  getModelsFromResponse (response) {
    return response.getData().items
  }

  routes () {
    return {
      fetch: APP_SETTINGS.appApiBaseURL + '/page/template-files/',
    }
  }
}

export default {
  model: FileTemplateModel,
}

</script>
