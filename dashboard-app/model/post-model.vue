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


class PostModel extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'post-put',
      (data) => {
        if (this.get('_id') !== data.data._id)
          return

        if (this.getOption('initialPostContent').toString() !== data.data.post_content.toString())
          this.setOption('hasNewVersionContent', true)
        let currentPostContent = this.get('post_content')
        this.set(data.data)
        this.set('post_content', currentPostContent)
      }
    )
    socketIO.registerEvent(
      'post-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
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
      fetch: APP_SETTINGS.appApiBaseURL + '/post/{_id}',
      save: APP_SETTINGS.appApiBaseURL + '/post/',
      put: APP_SETTINGS.appApiBaseURL + '/post/{_id}',
      delete: APP_SETTINGS.appApiBaseURL + '/post/{_id}',
    }
  }
}

export default {
  model: PostModel,
}

</script>
