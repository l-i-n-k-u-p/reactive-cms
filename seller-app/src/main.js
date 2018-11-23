import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';
import axios from 'axios'

Vue.use(VueRouter);
Vue.use(VueAxios, axios);

import App from './app.vue';
import DisplayItems from './components/display-items.vue';
import CreateItem from './components/create-item.vue';
import EditItem from './components/edit-item.vue';

const appBaseURL = '/dashboard-seller';
Vue.prototype.$appBaseURL = appBaseURL;
Vue.prototype.$appBaseAPIURL = appBaseURL+'/api';


const routes = [
    {
        name: 'display-items',
        path: appBaseURL,
        component: DisplayItems
    },
    {
        name: 'create-item',
        path: appBaseURL+'/create',
        component: CreateItem
    },
    {
        name: 'edit-item',
        path: appBaseURL+'/edit/:id',
        component: EditItem
    }
];

const router = new VueRouter({mode: 'history', routes: routes});

new Vue(Vue.util.extend({router}, App)).$mount('#app');
