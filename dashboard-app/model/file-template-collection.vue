<script>
import BaseCollection from './structure/base-collection'
import APP_SETTINGS from '../app-settings'


class FileTemplateCollection extends BaseCollection {
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/page/template-files/`,
    }
  }
}

export default {
  model: FileTemplateCollection,
}
</script>
