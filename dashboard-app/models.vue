<script>
import {
  Model,
  Collection,
} from 'vue-mc'
import SocketIO from './socket-io'
const appApiBaseURL = '/dashboard/api/v1'
let socketIO = new SocketIO()


class User extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'user-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'user-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
  }
  defaults () {
    return {
      user_name: '',
      user_pass: '',
      user_email: '',
      user_first_name: '',
      user_last_name: '',
      user_registration_date: '',
      user_active: '',
      user_thumbnail: '',
      user_avatar: '',
      user_role_ref: '',
      user_role: '',
      user_resource: '',
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
      fetch: appApiBaseURL + '/user/{_id}',
      // get: appApiBaseURL + '/user/{_id}',
      post: appApiBaseURL + '/user/',
      put: appApiBaseURL + '/user/{_id}',
      delete: appApiBaseURL + '/user/{_id}',
    }
  }
}

class UserList extends Collection {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'user-post',
      (data) => {
        if (this.models.length < 20) {
          this.add(data.data)
          let lastModel = this.models.pop()
          this.models.unshift(lastModel)
        }
      }
    )
  }
  model () {
    return User
  }
  getModelsFromResponse (response) {
    return response.getData().items
  }
  bulkDelete (params) {
    let method = 'DELETE'
    let route = this.getRoute('bulkDelete')
    let url = this.getURL(route, this.getRouteParameters())
    // let data = this._attributes
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  bulkUpdate (params) {
    let method = 'PUT'
    let route = this.getRoute('bulkDelete')
    let url = this.getURL(route, this.getRouteParameters())
    // let data = this._attributes
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/users/{page}',
      bulkDelete: appApiBaseURL + '/users/',
      bulkUpdate: appApiBaseURL + '/users/',
    }
  }
}

class SearchList extends Collection {
  getModelsFromResponse (response) {
    return response.getData().items
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/search/',
    }
  }
}

class SearchMediaList extends Collection {
  getModelsFromResponse (response) {
    return response.getData().items
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/search-media/',
    }
  }
}

class Post extends Model {
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
      fetch: appApiBaseURL + '/post/{_id}',
      post: appApiBaseURL + '/post/',
      put: appApiBaseURL + '/post/{_id}',
      delete: appApiBaseURL + '/post/{_id}',
    }
  }
}

class PostList extends Collection {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'post-post',
      (data) => {
        if (this.models.length < 60) {
          this.add(data.data)
          let lastModel = this.models.pop()
          this.models.unshift(lastModel)
        }
      }
    )
  }
  model () {
    return Post
  }
  getModelsFromResponse (response) {
    return response.getData().items
  }
  bulkDelete (params) {
    let method = 'DELETE'
    let route = this.getRoute('bulkDelete')
    let url = this.getURL(route, this.getRouteParameters())
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  bulkUpdate (params) {
    let method = 'PUT'
    let route = this.getRoute('bulkUpdate')
    let url = this.getURL(route, this.getRouteParameters())
    // let data = this._attributes
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/posts/{page}',
      bulkDelete: appApiBaseURL + '/posts/',
      bulkUpdate: appApiBaseURL + '/posts/',
    }
  }
}

class Page extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'page-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
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
      fetch: appApiBaseURL + '/page/{_id}',
      post: appApiBaseURL + '/page/',
      put: appApiBaseURL + '/page/{_id}',
      delete: appApiBaseURL + '/page/{_id}',
    }
  }
}

class PageList extends Collection {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'page-post',
      (data) => {
        if (this.models.length < 20) {
          this.add(data.data)
          let lastModel = this.models.pop()
          this.models.unshift(lastModel)
        }
      }
    )
  }
  model () {
    return Page
  }
  getModelsFromResponse (response) {
    return response.getData().items
  }
  bulkDelete (params) {
    let method = 'DELETE'
    let route = this.getRoute('bulkDelete')
    let url = this.getURL(route, this.getRouteParameters())
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  bulkUpdate (params) {
    let method = 'PUT'
    let route = this.getRoute('bulkUpdate')
    let url = this.getURL(route, this.getRouteParameters())
    // let data = this._attributes
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/pages/{page}',
      bulkDelete: appApiBaseURL + '/pages/',
      bulkUpdate: appApiBaseURL + '/pages/',
    }
  }
}

class Media extends Model {
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
      fetch: appApiBaseURL + '/media-file/{_id}',
      post: appApiBaseURL + '/media-file/',
      put: appApiBaseURL + '/media-file/{_id}',
      delete: appApiBaseURL + '/media-file/{_id}',
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

class MediaList extends Collection {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'media-post',
      (data) => {
        if (this.models.length < 20) {
          this.add(data.data)
          let lastModel = this.models.pop()
          this.models.unshift(lastModel)
        }
      }
    )
  }
  model () {
    return Media
  }
  getModelsFromResponse (response) {
    return response.getData().items
  }
  bulkDelete (params) {
    let method = 'DELETE'
    let route = this.getRoute('bulkDelete')
    let url = this.getURL(route, this.getRouteParameters())
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  bulkUpdate (params) {
    let method = 'PUT'
    let route = this.getRoute('bulkUpdate')
    let url = this.getURL(route, this.getRouteParameters())
    // let data = this._attributes
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/media-files/{page}',
      bulkDelete: appApiBaseURL + '/media-files/',
      bulkUpdate: appApiBaseURL + '/media-files/',
    }
  }
}

class Setting extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'settings-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'settings-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
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
      fetch: appApiBaseURL + '/setting/',
      post: appApiBaseURL + '/setting/',
      put: appApiBaseURL + '/setting/',
      delete: appApiBaseURL + '/setting/',
    }
  }
}

class Site extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'site-settings-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'site-settings-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
  }
  defaults () {
    return {
      site_name: '',
      site_items_peer_page: '',
      site_url: '',
      site_template_home: '',
      site_template_posts: '',
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
      fetch: appApiBaseURL + '/site/',
      post: appApiBaseURL + '/site/',
      put: appApiBaseURL + '/site/',
      delete: appApiBaseURL + '/site/',
    }
  }
}

class Dashboard extends Collection {
  getModelsFromResponse (response) {
    return response.getData().items
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/dashboard/',
    }
  }
}

class SettingPages extends Collection {
  getModelsFromResponse (response) {
    return response.getData().items
  }

  routes () {
    return {
      fetch: appApiBaseURL + '/setting/get-all-pages/',
    }
  }
}

class UserTypes extends Collection {
  getModelsFromResponse (response) {
    return response.getData().items
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/user/user-types/',
    }
  }
}

class FileTemplates extends Collection {
  getModelsFromResponse (response) {
    return response.getData().items
  }

  routes () {
    return {
      fetch: appApiBaseURL + '/page/template-files/',
    }
  }
}

class Role extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'role-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'role-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
  }
  defaults () {
    return {
      role_name: '',
      role_resources: '',
      role_user_ref: '',
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
      fetch: appApiBaseURL + '/role/{_id}',
      post: appApiBaseURL + '/role/',
      put: appApiBaseURL + '/role/{_id}',
      delete: appApiBaseURL + '/role/{_id}',
    }
  }
}

class RoleList extends Collection {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'role-post',
      (data) => {
        if (this.models.length < 20) {
          this.add(data.data)
          let lastModel = this.models.pop()
          this.models.unshift(lastModel)
        }
      }
    )
  }
  model () {
    return Role
  }
  getModelsFromResponse (response) {
    return response.getData().items
  }
  bulkDelete (params) {
    let method = 'DELETE'
    let route = this.getRoute('bulkDelete')
    let url = this.getURL(route, this.getRouteParameters())
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  bulkUpdate (params) {
    let method = 'PUT'
    let route = this.getRoute('bulkUpdate')
    let url = this.getURL(route, this.getRouteParameters())
    // let data = this._attributes
    let data = params
    return this.getRequest({ method, url, data }).send()
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/roles/{page}',
      bulkDelete: appApiBaseURL + '/roles/',
      bulkUpdate: appApiBaseURL + '/roles/',
    }
  }
}

class View extends Model {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'view-put',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.set(data.data)
      }
    )
    socketIO.registerEvent(
      'view-delete',
      (data) => {
        if (this.get('_id') === data.data._id)
          this.removeFromAllCollections()
      }
    )
  }
  defaults () {
    return {
      view_name: '',
      view_description: '',
    }
  }
}

class ViewList extends Collection {
  constructor (props) {
    super(props)
    this.listenPushMessages()
  }
  listenPushMessages () {
    socketIO.registerEvent(
      'view-post',
      (data) => {
        if (this.models.length < 20) {
          this.add(data.data)
          let lastModel = this.models.pop()
          this.models.unshift(lastModel)
        }
      }
    )
  }
  model () {
    return View
  }
  getModelsFromResponse (response) {
    return response.getData().items
  }
  routes () {
    return {
      fetch: appApiBaseURL + '/views/{page}',
    }
  }
}

export default {
  User: User,
  UserList: UserList,
  SearchList: SearchList,
  Post: Post,
  PostList: PostList,
  Page: Page,
  PageList: PageList,
  Media: Media,
  MediaList: MediaList,
  SearchMediaList: SearchMediaList,
  Setting: Setting,
  Site: Site,
  Dashboard: Dashboard,
  SettingPages: SettingPages,
  UserTypes: UserTypes,
  FileTemplates: FileTemplates,
  Role: Role,
  RoleList: RoleList,
  View: View,
  ViewList: ViewList,
  socketIO: socketIO,
}
</script>
