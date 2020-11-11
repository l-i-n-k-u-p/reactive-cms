<script>
import BaseCollection from './structure/base-collection'
import MediaModel from './media-model.vue'
import APP_SETTINGS from '../app-settings'


class MediaCollection extends BaseCollection {
  constructor (props) {
    super(props)
    this.listenPushMessages('media')
  }
  model () {
    return MediaModel.model
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/media-files/{page_number}/`,
    }
  }
}

export default {
  model: MediaCollection,
}
</script>
