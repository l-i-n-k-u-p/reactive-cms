<script>
import BaseCollection from './structure/base-collection'
import RoleModel from './role-model.vue'
import APP_SETTINGS from '../app-settings'


class RoleCollection extends BaseCollection {
  constructor (props) {
    super(props)
    this.listenPushMessages('role')
  }
  model () {
    return RoleModel.model
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/roles/{page_number}/`,
    }
  }
}

export default {
  model: RoleCollection,
}
</script>
