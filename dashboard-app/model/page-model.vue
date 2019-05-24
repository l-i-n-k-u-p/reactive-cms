<script>
import {
  Model,
} from 'vue-mc'
import {
  length,
  string,
} from 'vue-mc/validation'
import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'

let socketIO = new SocketIO()
let stripHTMLTagsRegex = /(<([^>]+)>)/gi


class PageModel extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'page-put',
      (data) => {
        if (this.get('_id') !== data.data._id)
          return

        if (this.getOption('initialPageContent').toString() !== data.data.page_content.toString())
          this.setOption('hasNewVersionContent', true)
        let currentPageContent = this.get('page_content')
        this.set(data.data)
        this.set('page_content', currentPageContent)
      }
    )
    socketIO.registerEvent(
      'page-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
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
      page_content: (value) => {
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
  post () {
    let method = 'POST'
    let route = this.getRoute('post')
    let url = this.getURL(route, this.getRouteParameters())
    let data = this._attributes
    return this.getRequest({ method, url, data }).send()
  }
  put () {
    let method = 'PUT'
    let route = this.getRoute('put')
    let url = this.getURL(route, this.getRouteParameters())
    let data = this._attributes
    return this.getRequest({ method, url, data }).send()
  }
  delete () {
    let method = 'DELETE'
    let route = this.getRoute('delete')
    let url = this.getURL(route, this.getRouteParameters())
    let data = this._attributes
    return this.getRequest({ method, url, data }).send()
  }
  routes () {
    return {
      fetch: APP_SETTINGS.appApiBaseURL + '/page/{_id}',
      save: APP_SETTINGS.appApiBaseURL + '/page/',
      put: APP_SETTINGS.appApiBaseURL + '/page/{_id}',
      delete: APP_SETTINGS.appApiBaseURL + '/page/{_id}',
    }
  }
}

export default {
  model: PageModel,
}

</script>
