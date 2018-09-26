<template>
    <div class="home-wrap" id="home">
        <el-container class="outest-container">
            <el-header class="header">
                <top-nav></top-nav>
            </el-header>
            <el-container>
                <el-aside class="aside-wrap">
                    <aside-nav></aside-nav>
                </el-aside>
                <el-container>

                <el-main class="main-wrap">
                    <router-view></router-view>
                </el-main>
                <el-footer>
                    <footer-c></footer-c>
                </el-footer>
                </el-container>
            </el-container>
            
        </el-container>
        
    </div>
</template>

<style lang="scss" scoped>
    .home-wrap {
        width: 100%;
        height: 100%;

        min-height: 600px;
        .outest-container {
            width: 100%;
            height: 100%;
        }
        .header {
            padding: 0;
        }
        .aside-wrap {
            width: auto!important;
        }
        .el-footer {
            position: relative;
            height: auto!important;
        }
    }
</style>

<script>
import Footer from './Footer';
import TopNav from './TopNav';
import AsideNav from './AsideNav';

export default {
    name: "Home",
    data () {
        return {
            
        }
    },
    methods: {
        
    },
    components: {
        "footer-c": Footer,
        "top-nav": TopNav,
        "aside-nav": AsideNav
    }


}
</script>
