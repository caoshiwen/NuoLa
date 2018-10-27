import Vue from 'vue'
import Router from 'vue-router'
/** Lazy Loading Routes */
import Util from '../assets/Util'
// import Home from '../components/Home'
const Home = () => import('../components/Home.vue')
// import Account from '../components/Account'
const Account = () => import('../components/Account.vue')
// import Info from '../components/Info'
const Info = () => import('../components/Info.vue')
const Address = () => import('../components/Address.vue')
// import Setting from '../components/Setting'
const Setting = () => import('../components/Setting.vue')
// import Shop from '../components/Shop'
const Shop = () => import('../components/Shop.vue')
// import ProductDetail from '../components/ProductDetail'
const ProductDetail = () => import('../components/ProductDetail.vue')
// import ShoppingCart from '../components/ShopingCart'
const ShoppingCart = () => import('../components/ShopingCart.vue')

const TemporaryOrder = () => import('../components/TemporaryOrder.vue')
const Orders = () => import('../components/Orders.vue')
Vue.use(Router)



export default new Router({
  mode: "history",
  routes: [
    //home
    {
      path: '/',
      component: Home,
      meta: {
        title: 'Home | RuoLa'
      }
    },
    {
      path: '/home',
      component: Home,
      meta: {
        title: 'Home | RuoLa'
      }
    },
    //account
    {
      path: '/account',
      component: Account,
      meta: {
        title: 'Account | RuoLa'
      },
      beforeEnter: (to, from, next) => {
        if(!Util.checkLoginState(this.a.app)){
          next({path:"/home"});
        }else{
          next();
        }
      },
      children: [
        {
          path: '/',
          component: Setting,
          meta: {
            title: 'Setting | Account | RuoLa'
          },
        },{
          path: 'setting',
          component: Setting,
          meta: {
            title: 'Setting | Account | RuoLa'
          },
        },{
          path: 'info',
          component: Info,
          meta: {
            title: 'Info | Account | RuoLa'
          },
        },{
          path: 'address',
          component: Address,
          meta: {
            title: 'Address | Account | RuoLa'
          }
        },{
          path: 'cards'
          // component:,
        },{
          path: 'orders',
          component: Orders,
          meta: {
            title: 'Orders | Account | RuoLa'
          }
        }
      ]
    },
    //cart
    {
      path: '/cart',
      component: ShoppingCart,
      meta: {
        title: 'Cart | RuoLa'
      },
      beforeEnter: (to, from, next) => {
        if(!Util.checkLoginState(this.a.app)){
          next({path:"/home"});
        }else{
          next();
        }
      },
    },
    //product
    {
      path: '/shop/detail/:pid',
      component: ProductDetail,
      meta: {
        title: 'Detail | Shop | RuoLa'
      },
    },
    {
      path: '/shop/:toptype',
      component: Shop,
      meta: {
        title: 'Shop | RuoLa'
      },
    },
    {
      path: '/shop/:toptype/:type',
      component: Shop,
      meta: {
        title: 'Shop | RuoLa'
      },
    },
    //order
    {
      path: '/order/temporary',
      component: TemporaryOrder,
      meta: {
        title: 'Order | RuoLa'
      }
    },
    //orderin
    {
      path: '/orderin',
      component: OrderIn,
      meta: {
        title: 'OrderIn | RuoLa'
      }
    },
    //error redirect
    {
      path: "*",
      redirect: "/"
    }

  ]
})
