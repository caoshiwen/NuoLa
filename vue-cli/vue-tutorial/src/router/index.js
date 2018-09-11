import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Account from '../components/Account'
import Setting from '../components/Setting'
import Info from '../components/Info'
import Util from '../assets/Util'
Vue.use(Router)

export default new Router({
  // mode: "history",
  // base: '/RuoLa/',
  routes: [
    //home
    {
      path: '/',
      component: Home
    },
    {
      path: '/home',
      component: Home
    },
    //account
    {
      path: '/account',
      component: Account,
      beforeEnter: (to, from, next) => {
        if(!Util.checkLoginState()){
          next({path:"/home"});
        }else{
          next();
        }
      },
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
        },{
          path: 'address'
          // component:,
        },{
          path: 'cards'
          // component:,
        }
      ]
    },

    //error redirect
    {
      path: "*",
      redirect: "/"
    }

  ]
})
