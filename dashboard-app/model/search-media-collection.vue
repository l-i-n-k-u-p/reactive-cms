<script>
import BaseCollection from './structure/base-collection'
import APP_SETTINGS from '../app-settings'


class SearchMediaCollection extends BaseCollection {
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/search-media/`,
    }
  }
}

export default {
  model: SearchMediaCollection,
}
</script>
