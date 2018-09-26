import Vue from 'vue'
import Router from 'vue-router'
import Util from '../assets/Util'
import Login from '../components/Login'
import Home from '../components/Home'
import UserMag from '../components/UserMag'
import PowerList from '../components/PowerList'
import OperationList from '../components/OperationList'
Vue.use(Router)

export default new Router({
  // mode: "history",
  // base: '/RuoLa/',
  routes: [
    //home
    {
      path: '/',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (Util.checkLoginState()) {
          next({
            path: "/home"
          });
        } else {
          next();
        }
      },
    },
    {
      path: '/login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (Util.checkLoginState()) {
          next({
            path: "/home"
          });
        } else {
          next();
        }
      },
    },
    {
      path: '/home',
      component: Home,
      beforeEnter: (to, from, next) => {
        if (!Util.checkLoginState()) {
          next({path:"/login"});
          // next();
        } else {
          next();
        }
      },
      children: [{
        path: '/',
        component: UserMag
      }, {
        path: '/usermag',
        component: UserMag
      }, {
        path: '/powerlist',
        component: PowerList
      },{
        path: '/operationlist',
        component: OperationList
      }]
    },
    //error redirect
    {
      path: "*",
      redirect: "/"
    }

  ]
})
