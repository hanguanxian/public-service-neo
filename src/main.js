import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import qs from 'qs';
//import '../theme/index.css';    // theme
import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import store from './store'

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
new Vue({
	store,
    router,
    render: h => h(App)
}).$mount('#app');
