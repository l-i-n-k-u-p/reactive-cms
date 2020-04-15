<script>
import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class DashboardSettingModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('settings')
  }
  defaults () {
    return {
      setting_page_title: '',
      setting_items_peer_page: '',
    }
  }
  options () {
    return {}
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/dashboard-settings/`,
    }
  }
}

export default {
  model: DashboardSettingModel,
}
</script>
