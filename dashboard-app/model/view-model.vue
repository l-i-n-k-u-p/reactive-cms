<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'

let viewNameRegex = /[^a-z\-]+/g
let sapaceRegex = /(^\s)/g


class ViewModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('view')
  }
  defaults () {
    return {
      view_name: '',
      view_description: '',
    }
  }
  mutations () {
    return {
      view_name: String,
      view_description: String,
    }
  }
  validation () {
    return {
      view_name: value => {
        if (value.match(sapaceRegex))
          return "Not spaces only '-'"

        if (value.match(viewNameRegex))
          return 'Only letters'

        if (value.length < 2)
          return 'Must have a length of at least 2'

        return
      },
      view_description: string.and(length(2, 150)),
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/view/{_id}`,
      save: `${ APP_SETTINGS.appApiBaseURL }/view/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/view/{_id}`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/view/{_id}`,
    }
  }
}

export default {
  model: ViewModel,
}
</script>
