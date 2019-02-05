<script>
import {Model, Collection} from 'vue-mc'


const appApiBaseURL = '/dashboard/api/v1'

Pusher.logToConsole = true
const pusher = new Pusher('c6e6a7cab15691ed1fab', {
    cluster: 'us2',
    forceTLS: true,
})

class User extends Model {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('put', (data) => {
            if(this.get('_id') === data.data._id)
                this.set(data.data)
        })

        this.getChannel().bind('delete', (data) => {
            if(this.get('_id') === data.data._id) {
                this.removeFromAllCollections()
            }
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-user')
    }

    defaults() {
        return {
            user_first_name: '',
            user_last_name: '',
            user_name: '',
            user_pass: '',
            user_email: '',
            user_type: '',
            user_registration_date: '',
        }
    }

    options() {
        return {}
    }

    post() {
        let method = 'POST'
        let route = this.getRoute('post')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    put() {
        let method = 'PUT'
        let route = this.getRoute('put')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    delete() {
        let method = 'DELETE'
        let route = this.getRoute('delete')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/user/{_id}',
            // get: appApiBaseURL+'/user/{_id}',
            post:  appApiBaseURL+'/user/',
            put: appApiBaseURL+'/user/{_id}',
            delete: appApiBaseURL+'/user/{_id}',
        }
    }
}

class UserList extends Collection {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('post', (data) => {
            if(this.models.length < 20)
                this.add(data.data)
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-user')
    }

    model() {
        return User
    }

    getModelsFromResponse (response) {
        return response.getData().items
    }

    bulkDelete(params) {
        let method = 'DELETE'
        let route = this.getRoute('bulkDelete')
        let url = this.getURL(route, this.getRouteParameters())
        // let data = this._attributes
        let data = params

        return this.getRequest({method, url, data}).send()
    }

    bulkUpdate(params) {
        let method = 'PUT'
        let route = this.getRoute('bulkDelete')
        let url = this.getURL(route, this.getRouteParameters())
        // let data = this._attributes
        let data = params

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/users/{page}',
            bulkDelete: appApiBaseURL+'/users/',
            bulkUpdate: appApiBaseURL+'/users/',
        }
    }
}

class SearchList extends Collection {
    getModelsFromResponse (response) {
        return response.getData().items
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/search/',
        }
    }
}

class SearchMediaList extends Collection {
    getModelsFromResponse (response) {
        return response.getData().items
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/search-media/',
        }
    }
}

class Post extends Model {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('put', (data) => {
            if(this.get('_id') === data.data._id) {
                this.setOption('hasUpdate', true)
                this.set(data.data)
            }
        })

        this.getChannel().bind('delete', (data) => {
            if(this.get('_id') === data.data._id) {
                this.removeFromAllCollections()
            }
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-post')
    }

    defaults() {
        return {
            post_title: '',
            post_content: '',
            post_slug: '',
            post_date: '',
            post_status: '',
        }
    }

    options() {
        return {}
    }

    post() {
        let method = 'POST'
        let route = this.getRoute('post')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    put() {
        let method = 'PUT'
        let route = this.getRoute('put')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    delete() {
        let method = 'DELETE'
        let route = this.getRoute('delete')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/post/{_id}',
            post:  appApiBaseURL+'/post/',
            put: appApiBaseURL+'/post/{_id}',
            delete: appApiBaseURL+'/post/{_id}',
        }
    }
}

class PostList extends Collection {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('post', (data) => {
            if(this.models.length < 20)
                this.add(data.data)
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-post')
    }

    model() {
        return Post
    }

    getModelsFromResponse (response) {
        return response.getData().items
    }

    bulkDelete(params) {
        let method = 'DELETE'
        let route = this.getRoute('bulkDelete')
        let url = this.getURL(route, this.getRouteParameters())
        let data = params

        return this.getRequest({method, url, data}).send()
    }

    bulkUpdate(params) {
        let method = 'PUT'
        let route = this.getRoute('bulkUpdate')
        let url = this.getURL(route, this.getRouteParameters())
        // let data = this._attributes
        let data = params

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/posts/{page}',
            bulkDelete: appApiBaseURL+'/posts/',
            bulkUpdate: appApiBaseURL+'/posts/',
        }
    }
}

class Page extends Model {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('put', (data) => {
            if(this.get('_id') === data.data._id) {
                this.setOption('hasUpdate', true)
                this.set(data.data)
            }
        })

        this.getChannel().bind('delete', (data) => {
            if(this.get('_id') === data.data._id) {
                this.removeFromAllCollections()
            }
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-page')
    }

    defaults() {
        return {
            page_title: '',
            page_content: '',
            page_slug: '',
            page_date: '',
            page_status: '',
            page_template: '',
            page_gallery: [],
        }
    }

    options() {
        return {}
    }

    post() {
        let method = 'POST'
        let route = this.getRoute('post')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    put() {
        let method = 'PUT'
        let route = this.getRoute('put')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    delete() {
        let method = 'DELETE'
        let route = this.getRoute('delete')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/page/{_id}',
            post:  appApiBaseURL+'/page/',
            put: appApiBaseURL+'/page/{_id}',
            delete: appApiBaseURL+'/page/{_id}',
        }
    }
}

class PageList extends Collection {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('post', (data) => {
            if(this.models.length < 20)
                this.add(data.data)
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-page')
    }

    model() {
        return Page
    }

    getModelsFromResponse (response) {
        return response.getData().items
    }

    bulkDelete(params) {
        let method = 'DELETE'
        let route = this.getRoute('bulkDelete')
        let url = this.getURL(route, this.getRouteParameters())
        let data = params

        return this.getRequest({method, url, data}).send()
    }

    bulkUpdate(params) {
        let method = 'PUT'
        let route = this.getRoute('bulkUpdate')
        let url = this.getURL(route, this.getRouteParameters())
        // let data = this._attributes
        let data = params

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/pages/{page}',
            bulkDelete: appApiBaseURL+'/pages/',
            bulkUpdate: appApiBaseURL+'/pages/',
        }
    }
}

class Media extends Model {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('put', (data) => {
            if(this.get('_id') === data.data._id) {
                this.setOption('hasUpdate', true)
                this.set(data.data)
            }
        })

        this.getChannel().bind('delete', (data) => {
            if(this.get('_id') === data.data._id) {
                this.removeFromAllCollections()
            }
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-media')
    }

    defaults() {
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

    options() {
        return {}
    }

    post() {
        let method = 'POST'
        let route = this.getRoute('post')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    put() {
        let method = 'PUT'
        let route = this.getRoute('put')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    delete() {
        let method = 'DELETE'
        let route = this.getRoute('delete')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/media-file/{_id}',
            post:  appApiBaseURL+'/media-file/',
            put: appApiBaseURL+'/media-file/{_id}',
            delete: appApiBaseURL+'/media-file/{_id}',
        }
    }

    isImage() {
        let mimetype = this.get('media_mime_type')
        if(mimetype == 'image/jpeg' || mimetype == 'image/png')
            return true
        return false
    }

    getMediaURL() {
        return '/public/uploads/'+this.get('media_name')
    }
}

class MediaList extends Collection {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('post', (data) => {
            if(this.models.length < 20)
                this.add(data.data)
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-media')
    }

    model() {
        return Media
    }

    getModelsFromResponse (response) {
        return response.getData().items
    }

    bulkDelete(params) {
        let method = 'DELETE'
        let route = this.getRoute('bulkDelete')
        let url = this.getURL(route, this.getRouteParameters())
        let data = params

        return this.getRequest({method, url, data}).send()
    }

    bulkUpdate(params) {
        let method = 'PUT'
        let route = this.getRoute('bulkUpdate')
        let url = this.getURL(route, this.getRouteParameters())
        // let data = this._attributes
        let data = params

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/media-files/{page}',
            bulkDelete: appApiBaseURL+'/media-files/',
            bulkUpdate: appApiBaseURL+'/media-files/',
        }
    }
}

class Setting extends Model {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('put', (data) => {
            if(this.get('_id') === data.data._id)
                this.set(data.data)
        })

        this.getChannel().bind('delete', (data) => {
            if(this.get('_id') === data.data._id) {
                this.removeFromAllCollections()
            }
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-setting')
    }

    defaults() {
        return {
            setting_page_title: '',
            setting_items_peer_page: '',
        }
    }

    options() {
        return {}
    }

    post() {
        let method = 'POST'
        let route = this.getRoute('post')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    put() {
        let method = 'PUT'
        let route = this.getRoute('put')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    delete() {
        let method = 'DELETE'
        let route = this.getRoute('delete')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/setting/',
            post:  appApiBaseURL+'/setting/',
            put: appApiBaseURL+'/setting/',
            delete: appApiBaseURL+'/setting/',
        }
    }
}

class Site extends Model {
    constructor(props) {
        super(props)
        this.listenPushMessages()
    }

    listenPushMessages() {
        this.getChannel().bind('put', (data) => {
            if(this.get('_id') === data.data._id) {
                this.setOption('hasUpdate', true)
                this.set(data.data)
            }
        })

        this.getChannel().bind('delete', (data) => {
            if(this.get('_id') === data.data._id) {
                this.removeFromAllCollections()
            }
        })
    }

    getChannel() {
        return pusher.subscribe('dashboard-site')
    }

    defaults() {
        return {
            site_name: '',
            site_items_peer_page: '',
            site_url: '',
            site_template_home: '',
            site_template_posts: '',
        }
    }

    options() {
        return {}
    }

    post() {
        let method = 'POST'
        let route = this.getRoute('post')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    put() {
        let method = 'PUT'
        let route = this.getRoute('put')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    delete() {
        let method = 'DELETE'
        let route = this.getRoute('delete')
        let url = this.getURL(route, this.getRouteParameters())
        let data = this._attributes

        return this.getRequest({method, url, data}).send()
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/site/',
            post:  appApiBaseURL+'/site/',
            put: appApiBaseURL+'/site/',
            delete: appApiBaseURL+'/site/',
        }
    }
}

class Dashboard extends Collection {
    getModelsFromResponse (response) {
        return response.getData().items
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/dashboard/',
        }
    }
}

class SettingPages extends Collection {
    getModelsFromResponse (response) {
        return response.getData().items
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/setting/get-all-pages/',
        }
    }
}

class UserTypes extends Collection {
    getModelsFromResponse (response) {
        return response.getData().items
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/user/user-types/',
        }
    }
}

class FileTemplates extends Collection {
    getModelsFromResponse (response) {
        return response.getData().items
    }

    routes() {
        return {
            fetch: appApiBaseURL+'/page/template-files/',
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
}

</script>
