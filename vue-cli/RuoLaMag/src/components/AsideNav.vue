<template>
    <div class="menu-wrap" :class="{w200px:isCollapse}">
    <el-scrollbar style="height:100%;"  wrapStyle="" wrapClass="" viewClass="" viewStyle="" :noresize="false" tag="section">
        <div>
        <el-switch
        class="btn"
        v-model="isCollapse"
        active-color="#333"
        inactive-color="#eee">
        </el-switch>
        <el-menu
        :default-active="$route.path==='/home'?'/usermag':$route.path"
        class="aside-menu"
        :router="true"
        :unique-opened="true"
        :collapse="!isCollapse">
            <el-menu-item index="0">
                <i class="el-icon-document"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>管理员账号管理</span>
                </template>
                <el-menu-item index="/usermag">管理员列表</el-menu-item>
                <el-menu-item index="/userpower">权限分配</el-menu-item>
                <el-menu-item index="/operationpower">操作权限</el-menu-item>
                <el-menu-item index="1-3">操作记录</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>系统管理</span>
                </template>
                <el-menu-item index="/powerlist">权限列表</el-menu-item>
                <el-menu-item index="/operationlist">操作列表</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>产品管理</span>
                </template>
                <el-menu-item index="3-1">产品列表</el-menu-item>
                <el-menu-item index="3-2">产品上传</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
                </template>
                <el-menu-item index="4-1">订单列表</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>客户</span>
                </template>
                <el-menu-item index="5-1">客户管理</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>统计</span>
                </template>
                <el-menu-item index="6-1">订单统计</el-menu-item>
                <el-menu-item index="6-2">客户统计</el-menu-item>
                <el-menu-item index="6-3">产品统计</el-menu-item>
            </el-submenu>
        </el-menu>
        </div>
    </el-scrollbar>
    </div>
</template>

<style lang="scss" scoped>
.menu-wrap {
  height: 100%;
  position: relative;
  //   &.w200px{
  //       width: 200px;
  //   }
}

.aside-menu {
  height: 100%;
}

.btn {
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 100;
}
</style>
<style lang="scss">
.menu-wrap {
  .aside-menu:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
    height: 100%;
  }
  .el-scrollbar__view {
    height: 100%;
    & > div {
      height: 100%;
    }
  }
  // .el-menu-item.is-active {
  //     background-color: #999;
  //     color: #fff;
  // }
}
</style>

<script>
export default {
  name: "AsideNav",
  data() {
    return {
      isCollapse: true
    };
  }
};
</script>
