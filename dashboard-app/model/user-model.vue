<script>
import {
  length,
  string,
  email,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class UserModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('user')
  }
  defaults () {
    return {
      user_name: '',
      user_pass: '',
      user_email: '',
      user_first_name: '',
      user_last_name: '',
      user_registration_date: '',
      user_active: true,
      user_thumbnail: '',
      user_avatar: '',
      user_role_ref: '',
      user_role: '',
      user_resource: '',
      user_locale: 'en',
    }
  }
  mutations() {
    return {
      user_name: String,
      user_pass: String,
      user_email: String,
      user_first_name: String,
    }
  }
  validation() {
    return {
      user_name: string.and(length(2, 100)),
      user_pass: value => {
          let id = this.get('_id')
          if (id !== undefined && value === '')
            return ''

          if (value.length < 2 || value.length > 100)
            return 'Must have a length between 2 and 100'
          return ''
        },
      user_email: email,
      user_first_name: string.and(length(2, 100)),
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/user/{_id}`,
      save: `${ APP_SETTINGS.appApiBaseURL }/user/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/user/{_id}`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/user/{_id}`,
    }
  }
}

export default {
  model: UserModel,
}
</script>
