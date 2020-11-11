<script>
import BaseCollection from './structure/base-collection'
import PostModel from './post-model.vue'
import APP_SETTINGS from '../app-settings'


class PostCollection extends BaseCollection {
  constructor (props) {
    super(props)
    this.listenPushMessages('post')
  }
  model () {
    return PostModel.model
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/posts/{page_number}/`,
    }
  }
}

export default {
  model: PostCollection,
}
</script>
