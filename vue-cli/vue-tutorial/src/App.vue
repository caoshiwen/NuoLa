<template>
<div id="app">
  <common-nav></common-nav>
  <router-view></router-view>
  <common-footer></common-footer>
</div>
</template>

<script>
import Nav from './components/Nav'
import Footer from './components/Footer'
import CONST from './assets/CONST'
import Util from './assets/Util'
export default {
  name: 'App',
  components: {
    'common-nav': Nav,
    'common-footer': Footer
  },
  methods: {

  },
  mounted() {
    if(localStorage.rsa) {
      return;
    }
    this.$http
      .get(`${CONST.HOST}/users/rsa`,)
      .then(res => {
        let {
          data:{
            rsa
          }
        } = res;
        localStorage.rsa = JSON.stringify(rsa);
      })
      .catch(err => {
        Util.showTip(this, "warning", "UNKNOW ERROR!TRY REFESH YOUR WEBSITE!");
      });
  }
}
</script>

<style>
/* @import url('./assets/scss/font.css'); */
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
