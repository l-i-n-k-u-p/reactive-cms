import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios'
import axios from 'axios'

import App from './app.vue'
import Models from './models.vue'
import Dashboard from './components/dashboard.vue'
import Pages from './components/pages.vue'
import Posts from './components/posts.vue'
import Media from './components/media.vue'
import Users from './components/users.vue'
import Settings from './components/settings.vue'
import UserDetail from './components/user-components/user-detail.vue'
import UserCreate from './components/user-components/user-create.vue'
import PostDetail from './components/post-components/post-detail.vue'
import PostCreate from './components/post-components/post-create.vue'
import PageDetail from './components/page-components/page-detail.vue'
import PageCreate from './components/page-components/page-create.vue'
import MediaDetail from './components/media-components/media-detail.vue'
import MediaCreate from './components/media-components/media-create.vue'
import Error from './components/error.vue'

import {
  getHexColor,
  getAvatarURL,
  getThumbnailURL,
} from './lib'


Vue.use(VueRouter)
Vue.use(VueAxios, axios)

const appBaseURL = '/dashboard'
Vue.prototype.$eventHub = new Vue()
Vue.prototype.$models = Models
Vue.prototype.$appBaseURL = appBaseURL
Vue.prototype.$getHexColor = getHexColor
Vue.prototype.$getAvatarURL = getAvatarURL
Vue.prototype.$getThumbnailURL = getThumbnailURL

const routes = [
  {
    name: 'error',
    path: '*',
    component: Error,
  },
  {
    name: 'dashboard',
    path: appBaseURL,
    component: Dashboard,
  },
  {
    name: 'pages',
    path: appBaseURL + '/pages/:page',
    component: Pages,
  },
  {
    name: 'posts',
    path: appBaseURL + '/posts/:page',
    component: Posts,
  },
  {
    name: 'media',
    path: appBaseURL + '/media-files/:page',
    component: Media,
  },
  {
    name: 'users',
    path: appBaseURL + '/users/:page',
    component: Users,
  },
  {
    name: 'settings',
    path: appBaseURL + '/settings',
    component: Settings,
  },
  {
    name: 'user-detail',
    path: appBaseURL + '/user/:id',
    component: UserDetail,
  },
  {
    name: 'new-user',
    path: appBaseURL + '/new-user/',
    component: UserCreate,
  },
  {
    name: 'post-detail',
    path: appBaseURL + '/post/:id',
    component: PostDetail,
  },
  {
    name: 'new-post',
    path: appBaseURL + '/new-post/',
    component: PostCreate,
  },
  {
    name: 'page-detail',
    path: appBaseURL + '/page/:id',
    component: PageDetail,
  },
  {
    name: 'new-page',
    path: appBaseURL + '/new-page/',
    component: PageCreate,
  },
  {
    name: 'media-detail',
    path: appBaseURL + '/media/:id',
    component: MediaDetail,
  },
  {
    name: 'new-media',
    path: appBaseURL + '/new-media/',
    component: MediaCreate,
  },
]

const router = new VueRouter({ mode: 'history', routes: routes })

new Vue(Vue.util.extend({ router }, App)).$mount('#app')
