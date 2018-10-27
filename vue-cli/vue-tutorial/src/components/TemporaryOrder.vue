<template>
<div class="wrap">
<div id="cart" class="cart">
  <router-link tag="p" to="/cart" class="back">{{back}}</router-link>
  <h1 class="title">{{title}}</h1>
  <div class="info">
    <i class="el-icon-info info-icon"></i>
    {{info}}
  </div>
  <div class="little-title clearfix">
    <h2 class="your-order">{{'Your order'}}</h2>
    <h2 class="summary-title">{{'Summary'}}</h2>
  </div>
  <div class="order" v-if="products[0]">
    <div class="little-block address-block">
      <span class="order-spn">{{order}}</span>
      <div class="address clearfix">
        <p class="order-address">
          <span class="address-item" v-for="(item,key) in address" :key="key" v-if="key!=`id`&&key!=`label`&&key!=`save`">{{item}}{{key=='country'?"":","}}</span>
        </p>
      </div>
    </div>
    <div class="little-block product-item" v-for="(item,k,i) in products" :key="i">
      <router-link tag="div" :to="`/shop/detail/${item.pid}`" class="img-block float-left cursor-pointer">
        <img class="img" :src="SOURCE_HOST+item.img">
      </router-link >
      <div class="word-block float-left">
        <router-link tag="a" :to="`/shop/detail/${item.pid}`" class="name">{{item.name}}</router-link>
        <p class="types">{{item.pt_type.toLowerCase() + ' | ' + item.type }}</p>
        <p class="others">{{item.others.toLowerCase()}}</p>
      </div>
      <div class="price-block float-right">
        <p class="total"><span class="_d">$</span>{{(item.price*item.num).toFixed(2)}}</p>
        <p class="each-p"><span class="_d">$</span>{{item.price.toFixed(2)}}<span class="each-sp">{{each}}</span></p>
      </div>
      <div class="num-block float-right">
        <p class="quantity">{{quantity}}</p>
        <p class="info-num">{{item.num}}</p>
      </div>
    </div>
    <div class="little-block bottom-block">
      <div class="name">{{subtotal}}</div>
      <div class="value"><span class="_d">$</span>{{getSubtotal}}</div>
    </div>
    <div class="little-block bottom-block">
      <div class="name">{{shipping}}</div>
      <div class="value"><span class="_d">$</span>{{getShipping}}</div>
    </div>
    <div class="little-block bottom-block">
      <div class="name">{{taxes}}</div>
      <div class="value"><span class="_d">$</span>{{getTaxes}}</div>
    </div>
    <div class="little-block bottom-block">
      <div class="name">{{total}}</div>
      <div class="value"><span class="_d">$</span>{{getTotal}}</div>
    </div>
  </div>
  <div class="summary">
    <div>
      <div class="little-block bottom-block">
        <div class="name">{{subtotal}}</div>
        <div class="value"><span class="_d">$</span>{{getSubtotal}}</div>
      </div>
      <div class="little-block bottom-block">
        <div class="name">{{shipping}}</div>
        <div class="value"><span class="_d">$</span>{{getShipping}}</div>
      </div>
      <div class="little-block bottom-block">
        <div class="name">{{taxes}}</div>
        <div class="value"><span class="_d">$</span>{{getTaxes}}</div>
      </div>
      <div class="little-block bottom-block">
        <div class="name">{{total}}</div>
        <div class="value"><span class="_d">$</span>{{getTotal}}</div>
      </div>
    </div>
    <div class="little-block clearfix">
      <button class="btn float-right" type="button" @click="paySuccess">{{btn}}</button>
    </div>
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
.cart {
  min-width: $MIN_WIDTH;
  max-width: $MAX_WIDTH;
  margin: 0 auto;
  padding: 80px 2rem 1rem;
  @extend .clearfix;
}
.back {
  margin: 1em 0 0;
  text-transform: uppercase;
  display: inline-block;
  padding: 0.4em 0.6em;
  transition: 0.3s all;
  border-radius: 2px;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
}
.title {
  padding: 0.8rem 0 2rem;
  font-size: 40px;
}
.little-title {
  font-size: 22px;
  margin-bottom: 6px;
  .your-order {
    width: 68%;
    margin-right: 2%;
    float: left;
  }
  .summary-title {
    width: 30%;
    float: left;
  }
}
.order {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  width: 68%;
  margin-right: 2%;
  float: left;
  .little-block {
    padding: 0 16px;
    @extend .clearfix;
  }
  .address-block {
    padding: 0 16px;
    line-height: 48px;
    .order-spn {
      font-size: 22px;
      margin-right: 10px;
    }
    .address {
      float: right;
      font-size: 15px;
      .address-item {
        color: #999;
        margin-right: 2px;
      }
      .edit {
        font-size: 12px;
        background-color: #323232;
        border-color: #323232;
        padding: 4px 8px;
      }
      .edit:hover {
        opacity: 0.8;
      }
    }
  }
  .product-item {
    border-top: 1px solid #e0e0e0;
    padding: 11px 16px;
    text-transform: capitalize;
    .img-block {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      line-height: 0;
      overflow: hidden;
      .img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .word-block {
      margin-left: 16px;
      .name {
        font-size: 18px;
        color: #000;
      }
      .types {
        font-size: 16px;
        color: #333;
        margin-top: 3px;
      }
      .others {
        color: #999;
        font-style: italic;
        margin-top: 6px;
        font-weight: 100;
        word-spacing: 3px;
      }
      p {
        margin: 0;
      }
    }
    .price-block {
      margin-left: 0px;
      min-width: 200px;
      text-align: right;
      ._d {
        margin-left: 4px;
      }
      .total {
        font-size: 18px;
        color: #333;
        margin: 0;
        margin-top: 16px;
      }
      .each-p {
        font-size: 14px;
        color: #999;
        margin: 0;
        font-style: italic;
        margin-top: 6px;
      }
      .each-sp {
        margin-left: 3px;
      }
    }
    .num-block {
      .quantity {
        margin: 0;
        margin-top: 12px;
        font-size: 12px;
        color: #999;
      }
      .info-num {
        margin-bottom: 10px;
      }
    }
  }
  .bottom-block {
    padding: 12px 16px;
    border-top: 1px solid #e0e0e0;
    font-weight: 500;
    @extend .clearfix;
    .name {
      float: left;
      text-transform: capitalize;
      color: rgba(0, 0, 0, 0.87);
      font-size: 16px;
    }
    .value {
      float: right;
      font-size: 18px;
    }
    ._d {
      margin-right: 4px;
    }
  }
}
.summary {
  float: left;
  width: 30%;

  .bottom-block {
    background-color: #fff;
    padding: 12px 16px;
    border-top: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    font-weight: 500;
    &:nth-last-of-type(1) {
      border-bottom: 1px solid #e0e0e0;
    }
    @extend .clearfix;
    .name {
      float: left;
      text-transform: capitalize;
      color: #999;
      font-size: 16px;
    }
    .value {
      float: right;
      font-size: 18px;
    }
    ._d {
      margin-right: 4px;
    }
  }
}
.btn {
  background-color: #1e88e5;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease-out;
  border: none;
  color: #fff;
  padding: 10px 26px;
  text-transform: uppercase;
  border-radius: 2px;
  margin-top: 40px;
  margin-bottom: 4px;
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }
}
.address {
  width: calc(100% - 120px);
}
.order-address {
  margin: 0;
  max-width: calc(100%);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 48px;
  float: right;
  margin-right: 3px;
}
.info {
  background-color: #e0e0e0;
  font-size: 15px;
  padding: 1.2rem;
  border-radius: 2px;
  line-height: 18px;
  margin-bottom: 20px;
  .info-icon {
    margin-right: 6px;
    font-size: 18px;
  }
}
</style>
<style lang="scss">
</style>

<script>
import Rsa from "../assets/Encryption";
import Util from "../assets/Util";
import CONST from "../assets/CONST";
const HOST = CONST.HOST;
export default {
  name: "Shop",
  data() {
    return {
      info:
        "Please note international orders may take 10-30 days to arrive. We strongly advise adding tracking. If you would like express shipping please contact us.",
      back: "← Back to cart",
      SOURCE_HOST: CONST.SOURCE_HOST,
      title: "Comfirm your order",
      order: "Order",
      edit: "EDIT",
      quantity: "quantity",
      each: "each",
      btn: "PAY SUCCESS",
      address: {
        id: "",
        label: "",
        name: "",
        phone: "",
        street_address: "",
        postal_code: "",
        city: "",
        state: "",
        country: ""
      },
      products: [],
      subtotal: "subtotal",
      shipping: "shipping (without tracking)",
      taxes: "Taxes",
      total: "TOTAL"
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    showTip: function(message, type) {
      Util.showTip(this, type, message);
    },
    getData() {
      let key = Rsa.encryptRsa(this.$store.state.user.key);
      let id = Rsa.encryptRsa(this.$store.state.user.id);
      this.$http
        .post(CONST.HOST + "/cart/unpaid", {
          key,
          id
        })
        .then(response => {
          let {
            data: { result, service_code }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
            console.log(result)
          switch (service_code) {
            case CONST.CART:
              this.products = result;
              if (result.length) {
                this.setAddress(result[0].address);
              }else{
                this.$router.push('/cart');
              }
              break;
            case CONST.CART_NO_ADDRESS:
              this.$router.push('/cart');
              break;
            case CONST.USER_LOGIN_STATE_NONE:
              Util.noLogonStatusCallBack(this);
              break;
            default:
              this.showTip(
                "SOMETHING WRONG! PLEASE CONTACT TO US, THANK YOU!",
                "warning"
              );
              break;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    setAddress(obj) {
      this.address.id = obj.id;
      this.address.label = obj.label;
      this.address.name = obj.name;
      this.address.phone = obj.phone;
      this.address.street_address = obj.street_address;
      this.address.postal_code = obj.postal_code;
      this.address.city = obj.city;
      this.address.state = obj.state;
      this.address.country = obj.country;
    },
    paySuccess() {
      this.addOrders();
    },
    addOrders() {
      let key = Rsa.encryptRsa(this.$store.state.user.key);
      let id = Rsa.encryptRsa(this.$store.state.user.id);
      this.$http
        .post(CONST.HOST + "/order/add", {
          key,
          id
        })
        .then(response => {
          let {
            data: { result, service_code }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
          switch (service_code) {
            case CONST.ORDER_ADD:
            this.$store.commit("delAllCart");
            this.showTip(
                "SUCCESS! YOU CAN CHECK IN ORDERS!",
                "success"
              );
              break;
            case CONST.ORDER_ADD_FAULT:
            this.showTip(
                "FAULT!",
                "warning"
              );
              break;
            case CONST.USER_LOGIN_STATE_NONE:
              Util.noLogonStatusCallBack(this);
              break;
            default:
              this.showTip(
                "SOMETHING WRONG! PLEASE CONTACT TO US, THANK YOU!",
                "warning"
              );
              break;
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  computed: {
    getSubtotal() {
      let total = 0;
      for (const key in this.products) {
        if (this.products.hasOwnProperty(key)) {
          const element = this.products[key];
          total += element.num * element.price;
        }
      }
      return total.toFixed(2);
    },
    getShipping() {
      return (this.getSubtotal * 0.1).toFixed(2);
    },
    getTaxes() {
      return (this.getSubtotal * 0.1).toFixed(2);
    },
    getTotal() {
      return (
        this.getSubtotal -
        0 +
        (this.getShipping - 0) +
        (this.getTaxes - 0)
      ).toFixed(2);
    }
  }
};
</script>
 