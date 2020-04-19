<script>
import {
  length,
  string,
} from 'vue-mc/validation'

import BaseModel from './structure/base-model'
import APP_SETTINGS from '../app-settings'


let stripHTMLTagsRegex = /(<([^>]+)>)/gi


class PageModel extends BaseModel {
  constructor (props) {
    super(props)
    this.listenPushMessages('page')
  }
  defaults () {
    return {
      page_title: '',
      page_content: '',
      page_thumbnail: '',
      page_slug: '',
      page_date: '',
      page_status: '',
      page_template: '',
      page_gallery: [],
    }
  }
  mutations() {
    return {
      page_title: String,
      page_content: String,
    }
  }
  validation() {
    return {
      page_title: string.and(length(2, 150)),
      page_content: value => {
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
      initialPageContent: '',
    }
  }
  routes () {
    return {
      fetch: `${ APP_SETTINGS.appApiBaseURL }/page/{_id}`,
      save: `${ APP_SETTINGS.appApiBaseURL }/page/`,
      put: `${ APP_SETTINGS.appApiBaseURL }/page/{_id}`,
      delete: `${ APP_SETTINGS.appApiBaseURL }/page/{_id}`,
    }
  }
}

export default {
  model: PageModel,
}
</script>
