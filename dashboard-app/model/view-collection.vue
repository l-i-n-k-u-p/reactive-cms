<script>
import BaseCollection from './structure/base-collection'
import ViewModel from './view-model.vue'
import APP_SETTINGS from '../app-settings'


class ViewCollection extends BaseCollection {
  constructor (props) {
    super(props)
    this.listenPushMessages('view')
  }
  model () {
    return ViewModel.model
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/views/{page_number}/`,
      fetchAll: `${ APP_SETTINGS.appApiBaseURL }/views-all/`,
    }
  }
}

export default {
  model: ViewCollection,
}
</script>
