import Vue from 'vue';
import Vuex from 'vuex'

import Util from './Util';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: sessionStorage.user?JSON.parse(sessionStorage.user):false||{},
  },
  mutations: {
    changeUser(state, payload) {
      let user = {...payload.user};
      state.user = user;
      Util.setUserStorage(JSON.stringify(state.user));
    },
    removeUser(state){
      state.user = {};
      Util.removeUserStorage();
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
    }
  } 
});

export default store;