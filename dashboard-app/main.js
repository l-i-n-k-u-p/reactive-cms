import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios'
import UUID from 'vue-uuid'
import axios from 'axios'

// NOTE: libraries
import {
  getHexColor,
  getAvatarURL,
  getThumbnailURL,
  aclReplaceVNode,
  aclUserCan,
} from './lib/lib'
import SocketIO from './lib/socket-io'
// NOTE: directives
import APP_SETTINGS from './app-settings'
import GLOBAL_DIRECTIVES from './directive/global-directives.vue'
import ACL_DIRECTIVES from './directive/acl-directives.vue'
// NOTE: models
import UserModel from './model/user-model.vue'
import UserListModel from './model/user-list-model.vue'
import SearchListModel from './model/search-list-model.vue'
import PostModel from './model/post-model.vue'
import PostListModel from './model/post-list-model.vue'
import PageModel from './model/page-model.vue'
import PageListModel from './model/page-list-model.vue'
import MediaModel from './model/media-model.vue'
import MediaListModel from './model/media-list-model.vue'
import SearchMediaListModel from './model/search-media-list-model.vue'
import SettingModel from './model/setting-model.vue'
import SiteModel from './model/site-model.vue'
import DashboardModel from './model/dashboard-model.vue'
import FileTemplateModel from './model/file-template-model.vue'
import RoleModel from './model/role-model.vue'
import RoleListModel from './model/role-list-model.vue'
import ViewModel from './model/view-model.vue'
import ViewListModel from './model/view-list-model.vue'
// NOTE: components
import App from './app.vue'
import Dashboard from './component/dashboard.vue'
import Pages from './component/pages.vue'
import Posts from './component/posts.vue'
import Media from './component/media.vue'
import Users from './component/users.vue'
import Roles from './component/roles.vue'
import Settings from './component/settings.vue'
import UserDetail from './component/user-components/user-detail.vue'
import UserCreate from './component/user-components/user-create.vue'
import PostDetail from './component/post-components/post-detail.vue'
import PostCreate from './component/post-components/post-create.vue'
import PageDetail from './component/page-components/page-detail.vue'
import PageCreate from './component/page-components/page-create.vue'
import MediaDetail from './component/media-components/media-detail.vue'
import MediaCreate from './component/media-components/media-create.vue'
import RoleDetail from './component/role-components/role-detail.vue'
import RoleCreate from './component/role-components/role-create.vue'
import NotFound from './component/not-found.vue'


for (let directive of GLOBAL_DIRECTIVES.directives)
  Vue.directive(directive.name, directive.action)
for (let directive of ACL_DIRECTIVES.directives)
  Vue.directive(directive.name, directive.action)
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(UUID)
Vue.prototype.$eventHub = new Vue()
Vue.prototype.$models = {
  User: UserModel.model,
  Post: PostModel.model,
  Page: PageModel.model,
  Media: MediaModel.model,
  Setting: SettingModel.model,
  Site: SiteModel.model,
  Dashboard: DashboardModel.model,
  FileTemplate: FileTemplateModel.model,
  Role: RoleModel.model,
  View: ViewModel.model,
  ViewList: ViewListModel.model,
  UserList: UserListModel.model,
  SearchList: SearchListModel.model,
  PostList: PostListModel.model,
  PageList: PageListModel.model,
  MediaList: MediaListModel.model,
  SearchMediaList: SearchMediaListModel.model,
  RoleList: RoleListModel.model,
}
Vue.prototype.$appApiBaseURL = APP_SETTINGS.appApiBaseURL
Vue.prototype.$getHexColor = getHexColor
Vue.prototype.$getAvatarURL = getAvatarURL
Vue.prototype.$getThumbnailURL = getThumbnailURL
Vue.prototype.$aclReplaceVNode = aclReplaceVNode
Vue.prototype.$aclUserCan = aclUserCan
Vue.prototype.$socketIO = new SocketIO()

const routes = [
  {
    name: 'error',
    path: '*',
    component: NotFound,
  },
  {
    name: 'dashboard',
    path: APP_SETTINGS.appBaseURL,
    component: Dashboard,
  },
  {
    name: 'pages',
    path: APP_SETTINGS.appBaseURL + '/pages/:page',
    component: Pages,
  },
  {
    name: 'posts',
    path: APP_SETTINGS.appBaseURL + '/posts/:page',
    component: Posts,
  },
  {
    name: 'media',
    path: APP_SETTINGS.appBaseURL + '/media-files/:page',
    component: Media,
  },
  {
    name: 'users',
    path: APP_SETTINGS.appBaseURL + '/users/:page',
    component: Users,
  },
  {
    name: 'roles',
    path: APP_SETTINGS.appBaseURL + '/roles/:page',
    component: Roles,
  },
  {
    name: 'settings',
    path: APP_SETTINGS.appBaseURL + '/settings',
    component: Settings,
  },
  {
    name: 'user-detail',
    path: APP_SETTINGS.appBaseURL + '/user/:id',
    component: UserDetail,
  },
  {
    name: 'new-user',
    path: APP_SETTINGS.appBaseURL + '/new-user/',
    component: UserCreate,
  },
  {
    name: 'post-detail',
    path: APP_SETTINGS.appBaseURL + '/post/:id',
    component: PostDetail,
  },
  {
    name: 'new-post',
    path: APP_SETTINGS.appBaseURL + '/new-post/',
    component: PostCreate,
  },
  {
    name: 'page-detail',
    path: APP_SETTINGS.appBaseURL + '/page/:id',
    component: PageDetail,
  },
  {
    name: 'new-page',
    path: APP_SETTINGS.appBaseURL + '/new-page/',
    component: PageCreate,
  },
  {
    name: 'media-detail',
    path: APP_SETTINGS.appBaseURL + '/media/:id',
    component: MediaDetail,
  },
  {
    name: 'new-media',
    path: APP_SETTINGS.appBaseURL + '/new-media/',
    component: MediaCreate,
  },
  {
    name: 'role-detail',
    path: APP_SETTINGS.appBaseURL + '/role/:id',
    component: RoleDetail,
  },
  {
    name: 'new-role',
    path: APP_SETTINGS.appBaseURL + '/new-role/',
    component: RoleCreate,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes: routes,
  base: '/',
})

// NOTE: check for user permissions in router - Improve using Dynamic Route Matching
router.beforeResolve((to, from, next) => {
  if (to.name === 'error')
    return next()

  let res = aclUserCan('read', to.name)
  if (res)
    return next()

  next({
    name: 'error',
    params: {
      '0': to.path,
    },
  })
})

new Vue(Vue.util.extend({ router }, App)).$mount('#app')
