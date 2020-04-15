<script>
import {
  length,
  string,
  email,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class ProfileModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('user')
  }
  defaults () {
    return {
      user_name: '',
      user_email: '',
      user_first_name: '',
      user_last_name: '',
      user_registration_date: '',
      user_active: '',
      user_thumbnail: '',
      user_avatar: '',
      user_role_ref: '',
      user_role: '',
      user_resource: '',
    }
  }
  mutations() {
    return {
      user_name: String,
      user_email: String,
      user_first_name: String,
    }
  }
  validation() {
    return {
      user_name: string.and(length(2, 100)),
      user_pass: string.and(length(2, 100)),
      user_email: email,
      user_first_name: string.and(length(2, 100)),
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/profile/{_id}`,
      put: `${ APP_SETTINGS.appApiBaseURL }/profile/{_id}`,
    }
  }
}

export default {
  model: ProfileModel,
}

</script>
