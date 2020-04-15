<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


let stripHTMLTagsRegex = /(<([^>]+)>)/gi


class PostModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('post')
  }
  defaults () {
    return {
      post_title: '',
      post_content: '',
      post_thumbnail: '',
      post_slug: '',
      post_date: '',
      post_status: '',
    }
  }
  mutations() {
    return {
      post_title: String,
      post_content: String,
    }
  }
  validation() {
    return {
      post_title: string.and(length(2, 150)),
      post_content: (value) => {
        let valueStrip = value.replace(stripHTMLTagsRegex, '')
        if (valueStrip.length < 5)
          return 'Must have a length of at least 5'
      }
    }
  }
  options () {
    return {
      validateOnChange: true,
      validateOnSave: true,
      validateRecursively: true,
      saveUnchanged: true,
      useFirstErrorOnly: true,
      hasNewVersionContent: false,
      initialPostContent: '',
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/post/{_id}`,
      save: `${ APP_SETTINGS.appApiBaseURL }/post/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/post/{_id}`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/post/{_id}`,
    }
  }
}

export default {
  model: PostModel,
}
</script>
