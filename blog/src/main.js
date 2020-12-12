import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import marked from 'marked'

import axios from 'axios'

Vue.use(mavonEditor)

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:8888/routes'

Vue.prototype.$http = axios

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')