import Vue from 'vue';
import Vuex from 'vuex'

import Util from './Util';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: localStorage.user?JSON.parse(localStorage.user):false||{},
    types: null,
    cart: -1
  },
  mutations: {
    changeUser(state, payload) {
      let user = {...payload.user};
      state.user = user;
      Util.setUserStorage(JSON.stringify(state.user));
    },
    removeUser(state){
      state.user = {};
      state.cart = [];
      Util.removeUserStorage();
    },
    changeTypes(state, payload) {
      state.types = {...payload.types};
    },
    addCart(state) {
      if(state.cart==-1){
        state.cart =0;
      }
      state.cart++;
    },
    getCart(state, payload) {
      state.cart = payload.cart;
    },
    delCart(state) {
      if(state.cart==-1||state.cart==0){
        state.cart = 0;
      }else{
        state.cart--;
      }
    },
    delAllCart(state) {
      state.cart = 0;
    }
  },
  getters:{
    user(state) {
      if(state.user && state.user.name){
        Util.setUserStorage(JSON.stringify(state.user));
      }else if(Util.getUserStorage() == "{}"){
        Util.removeUserStorage();
      }
      return state.user;
    },
  } 
});

export default store;