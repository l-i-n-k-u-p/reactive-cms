<script>
import BaseCollection from './structure/base-collection'
import APP_SETTINGS from '../app-settings'


class SearchCollection extends BaseCollection {
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/search/`,
    }
  }
}

export default {
  model: SearchCollection,
}
</script>
