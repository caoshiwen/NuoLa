<template>
<div class="wrap">
<div id="detail" class="detail">
  <div class="imgs">
    <div class="img-wrap">
      <img class="img" :src="SOURCE_HOST+show_img" v-if="show_img">
    </div>
    <div class="img-list">
      <div class="little-img-wrap" v-for="(item,key) in imgs" :key="key" >
        <img class="little-img" :src="SOURCE_HOST+item" @click="show_img=item">
      </div>
    </div>
  </div>
  <div class="info">
    <h1 class="info-title">{{info.name}}</h1>
    <div class="info-types">
      <router-link :to="'/shop/'+info.pt_type" tag="a" class="info-type info-pt-type">{{info.pt_type.toLowerCase()}}</router-link > |
      <router-link :to="'/shop/'+info.pt_type+'/'+info.type" tag="a" class="info-type">{{info.type.toLowerCase()}}</router-link >
    </div>
    <template v-for="(p) in info.properties">
      <p class="prop-name" :key="p.name+'p'">{{p.name}}</p>
        <el-select v-model="p.value"  :key="p.name" class="prop-select">
          <el-option
            v-for="(item,index) in p.select"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
    </template>
    <div class="clearfix">
    <p class="prop-name">{{info.quantity.name}}</p>
    <el-input v-model="info.quantity.value" type="number" class="info-num" min="1" max="99999" @blur="numFouceOut"></el-input>
    <span class="info-x"> x </span>
    <span class="info-price">${{info.price}}</span>
    <div class="info-add-cart cursor-pointer" type="primary" @click="addCart"><span class="info-add">+</span>{{info.add_cart}}</div>
    </div>
    <div class="info-divider"></div>
    <p class="info-creator">{{info.creator.toLowerCase()}}</p>

  </div>
</div>
</div>
</template>

<style lang='scss' scoped>
@import "../assets/scss/reload.scss";
.wrap {
  width: 100%;
  height: 100%;
}
.detail {
  min-width: $MIN_WIDTH;
  max-width: $MAX_WIDTH;
  margin: 0 auto;
  padding: 80px 2rem 1rem;
  @extend .clearfix;
}
.imgs {
  width: 50%;
  position: relative;
  background: #ededed;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  float: left;
}
.img-wrap {
  width: 100%;
  .img {
    width: 100%;
  }
}
.img-list {
  width: 100%;
  height: 64px;
  .little-img-wrap {
    cursor: pointer;
    float: left;
    height: 100%;
    .little-img {
      height: 100%;
    }
  }
}

.info {
  width: 48%;
  min-height: 200px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  float: right;
  padding: 10px 16px;
  .info-title {
    font-size: 2.6rem;
    color: #323232;
    font-weight: 400;
  }
  .info-creator {
    color: #999;
    margin-top: 0.5rem;
    text-transform: capitalize;
    font-style: italic;
  }
  .info-types {
    color: #999;
    font-size: 1.2rem;
    margin-top: 0.2rem;
  }
  .info-type {
    font-size: 1.1rem;
    text-transform: capitalize;
    color: rgb(3, 155, 229);
  }
  .prop-select {
    display: block;
    border: none;
  }
  .prop-name {
    color: #999;
    margin: 30px 0 0;
    font-size: 10px;
    letter-spacing: 0.06em;
  }
  .info-num {
    width: 60px;
    float: left;
  }
  .info-x {
    font-size: 30px;
    color: #999;
    font-weight: 100;
    padding-top: 2px;
    display: block;
    float: left;
    margin-right: 20px;
    margin-left: 20px;
  }
  .info-price {
    font-weight: 100;
    font-size: 22px;
    padding-top: 8px;
    float: left;
  }
  .info-add-cart {
    background-color: rgb(236, 64, 122);
    border-color: rgb(236, 64, 122);
    float: right;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #fff;
    padding: 12px 30px;
    transition: 0.3s all ease-out;
    font-size: 18px;
    line-height: 1.5em;
    margin-top: -10px;
    &:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }
  }
  .info-add {
    font-size: 1.5em;
    float: left;
    margin-right: 6px;
  }
  .info-divider {
    height: 1px;
    background-color: #ddd;
    margin-top: 18px;
  }
}
</style>
<style lang="scss">
.prop-select.el-select {
  input {
    border: none;
    border-bottom: 1px solid rgb(158, 158, 158);
    border-radius: 0;
    padding-left: 0;
  }
  .el-icon-arrow-up {
    color: #000;
  }
}
.info-num {
  input {
    border: none;
    border-bottom: 1px solid rgb(158, 158, 158);
    border-radius: 0;
    padding-right: 0;
    padding-left: 0;
  }
}
.el-scrollbar {
  li {
    padding-left: 15px;
  }
}
</style>

<script>
import Rsa from "../assets/Encryption";
import Util from "../assets/Util";
import CONST from "../assets/CONST";
export default {
  name: "Shop",
  data() {
    return {
      SOURCE_HOST: CONST.SOURCE_HOST,
      imgs: [],
      show_img: "",
      info: {
        id: this.$route.params.pid,
        name: "",
        properties: [],
        creator: "",
        type: "",
        pt_type: "",
        price: 0.0,
        quantity: {
          name: "Quantity",
          value: 1
        },
        add_cart: "CART"
      }
    };
  },
  components: {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let id = this.$route.params.pid;
      this.$http
        .post(CONST.HOST + "/product/detail", {
          id: Rsa.encryptRsa(id)
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
          service_msg = Rsa.decryptRsa(service_msg);
          switch (service_code + "") {
            case CONST.PRODUCT_DETAIL:
              this.imgs = result[0].imgs; //[]
              if (this.imgs) {
                this.show_img = this.imgs[0];
              }
              this.info.name = result[0].name; //string
              this.info.creator = "Created By " + result[0].creator; //string
              this.info.price = result[0].price.toFixed(2); //double or float fixed(2)
              // this.info.creator_id = result[0].creator_id;
              let r = [];
              let a = {};
              let pop = result[0].properties ? result[0].properties : [];
              for (let i = 0; i < pop.length; i++) {
                let name = pop[i].name;
                if (!a.hasOwnProperty(name)) {
                  a[name] = r.length;
                  r.push({ name, select: [] });
                }
                r[a[name]]["select"].push(pop[i].value);
                r[a[name]]["value"] = r[a[name]]["select"][0];
              }
              this.info.properties = r;
              this.info.type = result[0].type;
              this.info.pt_type = result[0].pt_type;
              break;
            default:
              this.$message({
                type: "warning",
                message: "Mail delivery failed!"
              });
              break; //send error
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    numFouceOut() {
      let num = (this.info.quantity.value + "").replace(/[^0-9]/g, "");
      this.info.quantity.value = num ? parseInt(num) : 1;
    },
    addCart() {
      if (!this.$store.state.user.id) {
        Util.showTip(this, "warning", "PLEASE LOGIN FIRST!");
        return;
      }
      let pop = this.info.properties;
      let detail = [];
      for (const key in pop) {
        const a = {};
        if (pop.hasOwnProperty(key)) {
          const element = pop[key];
          a.name = element.name;
          a.value = element.value;
          detail.push(a);
        }
      }
      this.$http
        .post(CONST.HOST + "/cart/add", {
          detail: Rsa.encryptRsa(JSON.stringify(detail)),
          pid: Rsa.encryptRsa(this.info.id),
          id: Rsa.encryptRsa(this.$store.state.user.id),
          key: Rsa.encryptRsa(this.$store.state.user.key),
          num: Rsa.encryptRsa(this.info.quantity.value+"")
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
          service_msg = Rsa.decryptRsa(service_msg);
          switch (service_code + "") {
            case CONST.CART_ADD:
              this.$message({
                type: "success",
                message: "ADD SUCCESS!"
              });
              this.$store.commit("addCart");
              break;
            case CONST.CART_ADD_NUMBER_ADD:
              this.$message({
                type: "success",
                message: "ADD SUCCESS!"
              });
              break;
            case CONST.USER_LOGIN_STATE_NONE:
              Util.noLogonStatusCallBack(this);
              break;
            default:
              this.$message({
                type: "warning",
                message: "SOMETHING WRONG!"
              });
              break; //send error
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  computed: {}
};
</script>
 