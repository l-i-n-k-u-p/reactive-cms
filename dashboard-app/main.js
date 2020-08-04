import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios'
import UUID from 'vue-uuid'
import axios from 'axios'
import lodash from  'lodash'
import VueI18n from 'vue-i18n'

// NOTE: libraries
import {
  getHexColor,
  getAvatarURL,
  getThumbnailURL,
  aclReplaceVNode,
  aclUserCan,
  getCookie,
} from './lib/lib'
import sockerIO from './lib/socket-io.vue'
import localeEN from './i18n/locale-en'
import localeES from './i18n/locale-es'
// NOTE: directives
import APP_SETTINGS from './app-settings'
import GLOBAL_DIRECTIVES from './directive/global-directives.vue'
import ACL_DIRECTIVES from './directive/acl-directives.vue'
// NOTE: models
import UserModel from './model/user-model.vue'
import UserCollection from './model/user-collection.vue'
import SearchCollection from './model/search-collection.vue'
import PostModel from './model/post-model.vue'
import PostCollection from './model/post-collection.vue'
import PageModel from './model/page-model.vue'
import PageCollection from './model/page-collection.vue'
import MediaModel from './model/media-model.vue'
import MediaCollection from './model/media-collection.vue'
import SearchMediaCollection from './model/search-media-collection.vue'
import SettingModel from './model/setting-model.vue'
import SiteModel from './model/site-model.vue'
import DashboardCollection from './model/dashboard-collection.vue'
import FileTemplateCollection from './model/file-template-collection.vue'
import RoleModel from './model/role-model.vue'
import RoleCollection from './model/role-collection.vue'
import ViewModel from './model/view-model.vue'
import ViewCollection from './model/view-collection.vue'
import ProfileModel from './model/profile-model.vue'
import DashboardSettingModel from './model/dashboard-setting-model.vue'
// NOTE: components
import App from './app.vue'
import Dashboard from './component/dashboard.vue'
import Pages from './component/pages.vue'
import Posts from './component/posts.vue'
import MediaFiles from './component/media.vue'
import Users from './component/users.vue'
import Roles from './component/roles.vue'
import Views from './component/views.vue'
import Settings from './component/settings.vue'
import User from './component/user-components/user.vue'
import Post from './component/post-components/post.vue'
import Page from './component/page-components/page.vue'
import Media from './component/media-components/media.vue'
import Role from './component/role-components/role.vue'
import NotFound from './component/not-found.vue'
import Profile from './component/profile.vue'
import View from './component/view-components/view.vue'


for (let directive of GLOBAL_DIRECTIVES.directives)
  Vue.directive(directive.name, directive.action)
for (let directive of ACL_DIRECTIVES.directives)
  Vue.directive(directive.name, directive.action)
Vue.use(VueRouter)
Vue.use(lodash)
Vue.use(VueAxios, axios)
Vue.use(UUID)
Vue.use(VueI18n)
Vue.prototype.$eventHub = new Vue()
Vue.prototype.$models = {
  User: UserModel.model,
  Post: PostModel.model,
  Page: PageModel.model,
  Media: MediaModel.model,
  Setting: SettingModel.model,
  Site: SiteModel.model,
  DashboardCollection: DashboardCollection.model,
  FileTemplateCollection: FileTemplateCollection.model,
  Role: RoleModel.model,
  View: ViewModel.model,
  ViewCollection: ViewCollection.model,
  UserCollection: UserCollection.model,
  SearchCollection: SearchCollection.model,
  PostCollection: PostCollection.model,
  PageCollection: PageCollection.model,
  MediaCollection: MediaCollection.model,
  SearchMediaCollection: SearchMediaCollection.model,
  RoleCollection: RoleCollection.model,
  Profile: ProfileModel.model,
  DashboardSetting: DashboardSettingModel.model,
}
Vue.prototype.$appApiBaseURL = APP_SETTINGS.appApiBaseURL
Vue.prototype.$getHexColor = getHexColor
Vue.prototype.$getAvatarURL = getAvatarURL
Vue.prototype.$getThumbnailURL = getThumbnailURL
Vue.prototype.$aclReplaceVNode = aclReplaceVNode
Vue.prototype.$aclUserCan = aclUserCan
Vue.prototype.$getCookie = getCookie
Vue.prototype.$socketIO = new sockerIO.IO()

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: localeEN,
    es: localeES,
  },
})

const routes = [
  {
    title: '',
    name: 'error',
    path: '*',
    component: NotFound,
  },
  {
    title: 'dashboard',
    name: 'dashboard',
    path: APP_SETTINGS.appBaseURL,
    component: Dashboard,
  },
  {
    title: 'pages',
    name: 'pages',
    path: `${ APP_SETTINGS.appBaseURL }/pages/:page`,
    component: Pages,
  },
  {
    title: 'posts',
    name: 'posts',
    path: `${ APP_SETTINGS.appBaseURL }/posts/:page`,
    component: Posts,
  },
  {
    title: 'media',
    name: 'media',
    path: `${ APP_SETTINGS.appBaseURL }/media-files/:page`,
    component: MediaFiles,
  },
  {
    title: 'users',
    name: 'users',
    path: `${ APP_SETTINGS.appBaseURL }/users/:page`,
    component: Users,
  },
  {
    title: 'roles',
    name: 'roles',
    path: `${ APP_SETTINGS.appBaseURL }/roles/:page`,
    component: Roles,
  },
  {
    title: 'settings',
    name: 'settings',
    path: `${ APP_SETTINGS.appBaseURL }/settings`,
    component: Settings,
  },
  {
    title: 'user detail',
    name: 'user-detail',
    path: `${ APP_SETTINGS.appBaseURL }/user/:id`,
    component: User,
  },
  {
    title: 'new user',
    name: 'new-user',
    path: `${ APP_SETTINGS.appBaseURL }/user/`,
    component: User,
  },
  {
    title: 'post detail',
    name: 'post-detail',
    path: `${ APP_SETTINGS.appBaseURL }/post/:id`,
    component: Post,
  },
  {
    title: 'new post',
    name: 'new-post',
    path: `${ APP_SETTINGS.appBaseURL }/post/`,
    component: Post,
  },
  {
    title: 'page detail',
    name: 'page-detail',
    path: `${ APP_SETTINGS.appBaseURL }/page/:id`,
    component: Page,
  },
  {
    title: 'new page',
    name: 'new-page',
    path: `${ APP_SETTINGS.appBaseURL }/page/`,
    component: Page,
  },
  {
    title: 'media detail',
    name: 'media-detail',
    path: `${ APP_SETTINGS.appBaseURL }/media/:id`,
    component: Media,
  },
  {
    title: 'new media',
    name: 'new-media',
    path: `${ APP_SETTINGS.appBaseURL }/media/`,
    component: Media,
  },
  {
    title: 'role detail',
    name: 'role-detail',
    path: `${ APP_SETTINGS.appBaseURL }/role/:id`,
    component: Role,
  },
  {
    title: 'new role',
    name: 'new-role',
    path: `${ APP_SETTINGS.appBaseURL }/role/`,
    component: Role,
  },
  {
    title: 'profile',
    name: 'profile',
    path: `${ APP_SETTINGS.appBaseURL }/profile`,
    component: Profile,
  },
  {
    title: 'views',
    name: 'views',
    path: `${ APP_SETTINGS.appBaseURL }/views/:page/`,
    component: Views,
  },
  {
    title: 'view detail',
    name: 'view-detail',
    path: `${ APP_SETTINGS.appBaseURL }/view/:id/`,
    component: View,
  },
  {
    title: 'new view',
    name: 'new-view',
    path: `${ APP_SETTINGS.appBaseURL }/view/`,
    component: View,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes: routes,
  base: '/',
})

// NOTE: check for user permissions in router - Improve using Dynamic Route Matching
router.beforeResolve((to, from, next) => {
  let isExceptionRouteName = APP_SETTINGS.appRouterNameException.indexOf(to.name) >= 0
  if (to.name === 'error' || isExceptionRouteName)
    return next()

  let res = aclUserCan(to.name)
  if (res)
    return next()

  next({
    name: 'error',
    params: {
      '0': to.path,
    },
  })
})

const app = new Vue({
  el: '#app',
  i18n: i18n,
  router: router,
  render: h => h(App),
})
