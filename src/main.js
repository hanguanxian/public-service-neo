import Vue from 'vue';
import App from './App';
import router from './router';

import ElementUI from 'element-ui';

import axios from './axiosConfig.js';
import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import store from './store'

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
new Vue({
	store,
    router,
    render: h => h(App)
}).$mount('#app');
