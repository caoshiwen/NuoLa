<template>
    <div id='account-sidebar' class='wrap'>
        <div v-for='block in nav' :key='block.title'>
            <h3 class="block-title">{{block.title}}</h3>
            <router-link class="link-item" :to='item.link' v-for='item in block.list' :key="item.word">
                <i :class="item.icon"></i>
                {{item.word}}
            </router-link>
            <div class="line"></div>
        </div>
        <div v-for="(item,index) in other_link" :key='item.word'>
            <router-link :to="item.link" class="other-link link-item">{{item.word}}</router-link>
            <div class="line" v-if="index < other_link.length - 1"></div>
        </div>
    </div>
</template>

<style lang='scss' scoped>

.wrap {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.16), 0 2px 8px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
  border-radius: 2px;
  line-height: 1.5;
  padding: 1rem;
  font-size: 15px;
}
.block-title {
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: .3rem;
}
.line {
  background-color: rgb(224, 224, 224);
  height: 1px;
  margin: .5rem 0 1rem 0;
}
.link-item {
  display: block;
  text-decoration: none;
  width: 100%;
  box-sizing: content-box;
  padding: 0.6rem 1rem;
  margin-left: -1rem;
  line-height: 2rem;
  font-weight: 500;
  transition: background-color .3s;
  &.router-link-active,
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  i {
      font-size: 1.5rem;
      margin-top: .18rem;
      margin-right: 1rem;
      float: left;
  }
}
.other-link {
    font-weight: 600;
    line-height: 2rem;
    display: block;
}
</style>

<script>
export default {
  name: "AccountSidebar",
  data() {
    return {
      nav: [
        {
          title: "Account",
          list: [
            {
              icon: "el-icon-edit",
              word: "Products",
              link: "/account/products"
            },
            {
              icon: "el-icon-edit",
              word: "Orders",
              link: "/account/orders"
            },
            {
              icon: "el-icon-edit",
              word: "Collections",
              link: "/account/collections"
            },
            {
              icon: "el-icon-upload",
              word: "Mass upload",
              link: "/account/upload"
            }
          ]
        },
        {
          title: "Setting",
          list: [
            {
              icon: "el-icon-setting",
              word: "Info",
              link: "/account/info"
            },
            {
              icon: "el-icon-location",
              word: "Address",
              link: "/account/address"
            },
            {
              icon: "el-icon-edit",
              word: "Credit cards",
              link: "/account/cards"
            }
          ]
        }
      ],
      other_link:[
          {
              word: 'Open Art of Where store',
              link: '/store',
          },
          {
              word: 'Sign up for Wholesale and Drop Ship',
              link: '/register'
          }
      ]
    };
  }
};
</script>
