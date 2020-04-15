<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class RoleModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('role')
  }
  defaults () {
    return {
      role_name: '',
      role_resources: '',
      role_user_ref: '',
    }
  }
  mutations () {
    return {
      role_name: String,
    }
  }
  validation () {
    return {
      role_name: string.and(length(2, 150)),
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/role/{_id}`,
      save: `${ APP_SETTINGS.appApiBaseURL }/role/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/role/{_id}`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/role/{_id}`,
    }
  }
}

export default {
  model: RoleModel,
}

</script>
