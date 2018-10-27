<template>
<div class="wrap">
  <div id="account" class="account">
    <account-sidebar class="sidebar"></account-sidebar>
    <router-view class="content"></router-view>
  </div>
</div>
</template>

<style lang='scss' scoped>
  @import '../assets/scss/common.scss';
  .wrap{
    width: 100%;
    height: 100%;
    // background-color: rgb(238,238,238);
  }
  .account {
    min-width: $MIN_WIDTH;
    max-width: $MAX_WIDTH;
    margin: 0 auto;
    padding: 90px 2rem 1rem;
    @extend .clearfix;
    .sidebar {
      width: 25%;
      float: left;
    }
  }
  .content {

    
    // background-color: #fff;
    width: 70%;
    height: 100%;
    float: left;
    margin-left: 1.5rem;
  }
</style>

<script>
import AccountSidebar from './AccountSidebar'

export default {
    name: "Account",
    components: {
      'account-sidebar': AccountSidebar
    }
}
</script>
