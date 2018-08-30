import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Account from '../components/Account'
import Setting from '../components/Setting'
import Info from '../components/Info'

Vue.use(Router)

export default new Router({
  // mode: "history",
  // base: '/RuoLa/',
  routes: [
    {
      path: '/',
      component: Home
    },{
      path: '/home',
      component: Home
    },{
      path: '/account',
      component: Account,
      children: [
        {
          path: '',
          component: Setting,
        },{
          path: 'setting',
          component: Setting,
        },{
          path: 'info',
          component: Info,
        }
      ]
    }
  ]
})
