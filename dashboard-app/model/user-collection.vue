<script>
import BaseCollection from './structure/base-collection'
import UserModel from './user-model.vue'
import APP_SETTINGS from '../app-settings'


class UserCollection extends BaseCollection {
  constructor (props) {
    super(props)
    this.listenPushMessages('user')
  }
  model () {
    return UserModel.model
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/users/{page}`,
    }
  }
}

export default {
  model: UserCollection,
}
</script>
