<script>
import {
  Model,
} from 'vue-mc'
import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'


let socketIO = new SocketIO()

class PostModel extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'post-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
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
  options () {
    return {}
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
      post: APP_SETTINGS.appApiBaseURL + '/post/',
      put: APP_SETTINGS.appApiBaseURL + '/post/{_id}',
      delete: APP_SETTINGS.appApiBaseURL + '/post/{_id}',
    }
  }
}

export default {
  model: PostModel,
}

</script>
