<template>
<div id="app">
  <router-view></router-view>
</div>
</template>
<style lang="scss" scoped>
</style>
<script>
import CONST from "./assets/CONST";
import Util from "./assets/Util";

export default {
  name: "App",
  components: {},
  mounted() {
    if (sessionStorage.rsa) {
      return;
    }
    this.$http
      .get(`${CONST.HOST}/users/rsa`, {}, CONST.SESSION_CONFIG_CROS)
      .then(res => {
        let {
          data: { rsa }
        } = res;
        sessionStorage.rsa = JSON.stringify(rsa);
      })
      .catch(err => {
        Util.showTip(this, "warning", "UNKNOW ERROR!");
      });
  }
};
</script>



