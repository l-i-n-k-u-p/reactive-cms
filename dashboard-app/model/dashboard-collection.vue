<script>
import BaseCollection from './structure/base-collection'
import APP_SETTINGS from '../app-settings'


class DashboardCollection extends BaseCollection {
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
