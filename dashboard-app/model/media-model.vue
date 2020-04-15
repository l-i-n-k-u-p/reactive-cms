<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


class MediaModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('media')
  }
  defaults () {
    return {
      media_original_name: '',
      media_name: '',
      media_title: '',
      media_mime_type: '',
      media_size: '',
      media_path: '',
      media_date: '',
    }
  }
  mutations() {
    return {
      media_title: String,
    }
  }
  validation() {
    return {
      media_title: string.and(length(2, 150)),
    }
  }
  isImage () {
    let mimetype = this.get('media_mime_type')
    if (mimetype === 'image/jpeg' || mimetype === 'image/png')
    return true

    return false
  }
  getMediaURL () {
    return '/public/uploads/' + this.get('media_name')
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/media-file/{_id}`,
      save: `${ APP_SETTINGS.appApiBaseURL }/media-file/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/media-file/{_id}`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/media-file/{_id}`,
    }
  }
}


export default {
  model: MediaModel,
}
</script>
