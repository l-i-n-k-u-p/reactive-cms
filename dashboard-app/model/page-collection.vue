<script>
import BaseCollection from './structure/base-collection'
import PageModel from './page-model.vue'
import APP_SETTINGS from '../app-settings'


class PageCollection extends BaseCollection {
  constructor (props) {
    super(props)
    this.listenPushMessages('page')
  }
  model () {
    return PageModel.model
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/pages/{page_number}/`,
      bulkDelete: `${ APP_SETTINGS.appApiBaseURL }/pages/`,
      bulkUpdate: `${ APP_SETTINGS.appApiBaseURL }/pages/`,
    }
  }
}

export default {
  model: PageCollection,
}
</script>
