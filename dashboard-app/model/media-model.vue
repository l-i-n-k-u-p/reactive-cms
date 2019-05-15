<script>
import {
  Model,
} from 'vue-mc'
import SocketIO from '../lib/socket-io'
import APP_SETTINGS from '../app-settings'


let socketIO = new SocketIO()

class MediaModel extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'media-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'media-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
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
      fetch: APP_SETTINGS.appApiBaseURL + '/media-file/{_id}',
      post: APP_SETTINGS.appApiBaseURL + '/media-file/',
      put: APP_SETTINGS.appApiBaseURL + '/media-file/{_id}',
      delete: APP_SETTINGS.appApiBaseURL + '/media-file/{_id}',
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
}


export default {
  model: MediaModel,
}

</script>
