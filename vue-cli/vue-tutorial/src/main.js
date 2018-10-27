// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import router from "./router/index.js"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/PingFang.ttf'
import './assets/scss/common.scss'

import App from './App'
// import 'bootstrap/dist/css/bootstrap.css'
import store from './assets/Store'
// Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(Vuex)

router.afterEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  // components: { App },
  // template: '<App/>'
  ...App
})
