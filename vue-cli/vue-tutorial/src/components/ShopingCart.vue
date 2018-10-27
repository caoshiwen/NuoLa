<template>
<div class="wrap">
<div id="cart" class="cart">
  <h1 class="title">{{title}}<span v-if="!products[0]" class="empty"> (Empty) </span></h1>
  <div class="order" v-if="products[0]" v-loading="fullscreenLoading">
    <div class="little-block address-block">
      <span class="order-spn">{{order}}</span>
      <i class="el-icon-delete cursor-pointer"></i>
      <div class="address clearfix">
        <el-button type="info" size="mini" class="edit" @click="editClick">{{edit}}</el-button>
        <p class="order-address">
          <span class="address-item" v-for="(item,key) in address" :key="key" v-if="key!=`id`&&key!=`label`&&key!=`save`">{{item}}{{key=='country'?"":","}}</span>
        </p>
        <el-select class="address-select" v-model="AddressSelect.value" filterable :placeholder="AddressSelect.placeholder"
        :loading="AddressSelect.loading" loading-text="loading" :default-first-option='true' popper-class="address-drop"
        @change="changeSelect">
          <el-option
            v-for="item in AddressSelect.select"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="little-block product-item" v-for="(item,k) in products" :key="k">
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
      <i class="el-icon-delete cursor-pointer float-right del-item" @click="del(k)"></i>
      <div class="num-block float-right">
        <p class="quantity">{{quantity}}</p>
        <el-input-number v-model="item.num" controls-position="right" size="small" type="number" class="info-num" :min="1" :max="99999" @change="changeNum(k)"></el-input-number>
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
  </div>
  <div class="little-block clearfix" v-if="products[0]">
    <button to="/order/temporary" tag="button" class="btn float-right" type="button" @click="confirmOrder">{{btn}}</button>
  </div>
</div>
<address-block :AddressBlock="AddressBlock"></address-block>
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

.title {
  font-size: 40px;
  padding: 1.5rem 0 2rem;
  .empty {
    font-size: 24px;
    color: #999;
    font-style: italic;
  }
}
.order {
  background-color: #fff;
  border: 1px solid #e0e0e0;
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
      margin-left: 100px;
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
.del-item {
  margin-top: 36px;
  margin-left: 10px;
}
.address-select {
  // width: 15%;
  color: #999;
  font-size: 0.8em;
  border: none;
  float: right;
}
.address {
  width: calc(100% - 120px);
}
.order-address {
  margin: 0;
  max-width: calc(100% - 280px);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 48px;
  float: right;
  margin-right: 3px;
}
.edit {
  float: right;
  margin-top: 14px;
}
</style>
<style lang="scss">
.info-num {
  width: 60px;
  &:hover {
    .el-input-number__decrease,
    .el-input-number__increase {
      visibility: visible;
    }
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    visibility: hidden;
    border: none !important;
    background: none;
    text-align: right;
    width: 18px !important;
  }
  input {
    border: none;
    border-bottom: 1px solid rgb(158, 158, 158);
    border-radius: 0;
    padding-right: 0;
    padding-left: 0 !important;
    padding-right: 18px !important;
    text-align: left !important;
  }
}
.address {
  .address-select {
    border: none !important;
    .el-input {
      background: none !important;
      border: none !important;
      // border-bottom: 1px solid #999;
    }
    .el-input__inner {
      background: none !important;
      padding-left: 0;
      text-align: right !important;
      color: #999;
    }
  }
}
.address-drop {
  text-align: right !important;
  .popper__arrow {
    right: 35px;
    left: auto !important;
  }
}
</style>

<script>
import Rsa from "../assets/Encryption";
import Util from "../assets/Util";
import CONST from "../assets/CONST";
const HOST = CONST.HOST;
const AddressBlock = () => import("./AddressBlock.vue");
export default {
  name: "Shop",
  data() {
    return {
      fullscreenLoading: false,
      SOURCE_HOST: CONST.SOURCE_HOST,
      title: "Shopping cart",
      order: "Order",
      edit: "EDIT",
      quantity: "quantity",
      each: "each",
      btn: "Proceed to checkout",
      address: {
        id: "",
        label: "",
        name: "",
        phone: "",
        street_address: "",
        postal_code: "",
        city: "",
        state: "",
        country: "",
        save() {}
      },
      AddressSelect: {
        select: [
          {
            label: "label1",
            id: "1",
            name: "csw",
            phone: "15557986337",
            street_address: "义乌江滨西路112号",
            postal_code: "321000",
            city: "金华市",
            state: "浙江省",
            country: "China"
          },
          {
            label: "label2",
            id: "2",
            name: "csw2",
            phone: "15557986337",
            street_address: "义乌江滨西路112号",
            postal_code: "321000",
            city: "金华市",
            state: "浙江省",
            country: "China"
          }
        ],
        value: "1",
        placeholder: "address label",
        loading: false
      },
      products: [],
      subtotal: "subtotal",
      shipping: "shipping (without tracking)",
      AddressBlock: {
        show: false,
        title: "Add address",
        id: "",
        save() {
          console.log("savefn");
        },
        Label: {
          id: "label",
          name: "label",
          placeholder: "Label",
          value: "",
          type: "text",
          maxlength: 32
        },
        Name: {
          id: "name",
          name: "name",
          placeholder: "Name",
          value: "",
          type: "text",
          maxlength: 32
        },
        Phone: {
          id: "phone",
          name: "phone",
          placeholder: "Phone",
          value: "",
          type: "text",
          maxlength: 16
        },
        StreetAddress: {
          id: "stress-address",
          name: "stress-address",
          placeholder: "Stress Address",
          value: "",
          type: "text",
          maxlength: 255
        },
        PostalCode: {
          id: "postal-code",
          name: "postal-code",
          placeholder: "Postal Code",
          value: "",
          type: "text",
          maxlength: 6
        },
        City: {
          id: "city",
          name: "city",
          placeholder: "City",
          value: "",
          type: "text",
          maxlength: 64
        },
        Country: {
          value: "",
          select: ["China", "USA"],
          placeholder: "Country"
        },
        State: {
          id: "state",
          name: "state",
          placeholder: "State / Province",
          value: "",
          type: "text",
          maxlength: 64
        }
      }
    };
  },
  components: { "address-block": AddressBlock },
  mounted() {
    this.getData();
  },
  methods: {
    showTip: function(message, type) {
      Util.showTip(this, type, message);
    },
    getData() {
      this.getAddress();
      let key = Rsa.encryptRsa(this.$store.state.user.key);
      let id = Rsa.encryptRsa(this.$store.state.user.id);
      this.$http
        .post(CONST.HOST + "/cart/list", {
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
            case CONST.CART:
              this.products = result;
              if(!this.products.length) {
                this.showTip(
                  "EMPTY CART!",
                  "warning"
                );
              }
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
    numFouceOut() {
      let num = (this.info.quantity.value + "").replace(/[^0-9]/g, "");
      this.info.quantity.value = num ? parseInt(num) : 1;
    },
    del(k) {
      console.log(this.products[k]);
      this.$http
        .post(HOST + "/cart/del", {
          key: Rsa.encryptRsa(this.$store.state.user.key),
          id: Rsa.encryptRsa(this.$store.state.user.id),
          cid: Rsa.encryptRsa(this.products[k].cid)
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
          service_msg = Rsa.decryptRsa(service_msg);
          switch (service_code) {
            case CONST.CART_DEL:
              if (result.affectedRows) {
                Util.showTip(this, "success", "DELECT SUCCESS!");
                this.products.splice(k, 1);
              } else {
                Util.showTip(this, "warning", "DELECT FAILED!");
              }
              break;
            case CONST.USER_LOGIN_STATE_NONE:
              Util.noLogonStatusCallBack(this);
              break;
            default:
              Util.showTip(this, "warning", "WRONG CODE!");
              break;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    changeSelect(v) {
      let obj = this.AddressSelect.select;
      let id = "";
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key];
          if (element.id == v) {
            id = key;
            break;
          }
        }
      }
      this.setAddress(obj[id]);
    },
    getAddress(address_id) {
      let key = Rsa.encryptRsa(this.$store.state.user.key);
      let id = Rsa.encryptRsa(this.$store.state.user.id);
      this.$http
        .post(CONST.HOST + "/users/address/list", {
          key,
          id
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
          service_msg = Rsa.decryptRsa(service_msg);
          switch (service_code) {
            case CONST.USER_ADDRESS:
              this.AddressSelect.select = result;
              let index = 0;
              for (const key in result) {
                if (result.hasOwnProperty(key)) {
                  const element = result[key];
                  if (element.id == address_id) {
                    index = key;
                    break;
                  } else {
                    index = 0;
                  }
                }
              }
              this.AddressSelect.value = result[index].id;
              this.setAddress(result[index]);

              break;
            case CONST.USER_LOGIN_STATE_NONE:
              Util.noLogonStatusCallBack(this);
              break;
            default:
              this.showTip("WRONG CODE", "warning");
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
    editClick() {
      this.AddressBlock.show = true;
      let obj = this.address;
      obj.save = this.editSave;
      this.changeAddressBlock({ ...obj, title: "ADD ADDRESS" });
    },
    editSave() {
      if (!this.checkSave()) {
        Util.showTip(this, "warning", "INPUT ERROR!");
        return;
      }
      console.log(Rsa.encryptRsa(this.AddressBlock.id));
      this.$http
        .post(HOST + "/users/address/edit", {
          key: Rsa.encryptRsa(this.$store.state.user.key),
          id: Rsa.encryptRsa(this.$store.state.user.id),
          a_id: Rsa.encryptRsa(this.AddressBlock.id),
          label: Rsa.encryptRsa(this.AddressBlock.Label.value),
          name: Rsa.encryptRsa(this.AddressBlock.Name.value),
          phone: Rsa.encryptRsa(this.AddressBlock.Phone.value),
          city: Rsa.encryptRsa(this.AddressBlock.City.value),
          state: Rsa.encryptRsa(this.AddressBlock.State.value),
          country: Rsa.encryptRsa(this.AddressBlock.Country.value),
          postal_code: Rsa.encryptRsa(this.AddressBlock.PostalCode.value),
          street_address: Rsa.encryptRsa(this.AddressBlock.StreetAddress.value)
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
          service_msg = Rsa.decryptRsa(service_msg);
          switch (service_code) {
            case CONST.USER_ADDRESS_EDIT:
              if (result.affectedRows) {
                Util.showTip(this, "success", "EDIT SUCCESS!");
                this.AddressBlock.show = false;
                this.getAddress(this.AddressBlock.id);
              } else {
                Util.showTip(this, "warning", "EDIT FAILED!");
              }
              break;
            case CONST.USER_LOGIN_STATE_NONE:
              Util.noLogonStatusCallBack(this);
              break;
            default:
              Util.showTip(this, "warning", "WRONG CODE!");
              break;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    checkSave() {
      return (
        this.AddressBlock.Label.value &&
        this.AddressBlock.Name.value &&
        this.AddressBlock.Phone.value &&
        this.AddressBlock.City.value &&
        this.AddressBlock.State.value &&
        this.AddressBlock.Country.value &&
        this.AddressBlock.PostalCode.value &&
        this.AddressBlock.StreetAddress.value &&
        this.AddressBlock.title
      );
    },
    changeAddressBlock(obj) {
      this.AddressBlock.Label.value = obj.label;
      this.AddressBlock.Name.value = obj.name;
      this.AddressBlock.Phone.value = obj.phone;
      this.AddressBlock.City.value = obj.city;
      this.AddressBlock.State.value = obj.state;
      this.AddressBlock.Country.value = obj.country;
      this.AddressBlock.PostalCode.value = obj.postal_code;
      this.AddressBlock.StreetAddress.value = obj.street_address;
      this.AddressBlock.title = obj.title;
      this.AddressBlock.id = obj.id;
      this.AddressBlock.save = obj.save;
    },
    changeNum(k) {
      console.log(this.products[k]);
      if (!this.products[k].num) {
        this.products[k].num = 1;
      }
      this.$http
        .post(HOST + "/cart/editnum", {
          key: Rsa.encryptRsa(this.$store.state.user.key),
          id: Rsa.encryptRsa(this.$store.state.user.id),
          cid: Rsa.encryptRsa(this.products[k].cid),
          num: Rsa.encryptRsa(this.products[k].num + "")
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
          service_msg = Rsa.decryptRsa(service_msg);
          switch (service_code) {
            case CONST.CART_EDIT_NUM:
              if (result.affectedRows) {
                Util.showTip(this, "success", "EDIT SUCCESS!");
              } else {
                Util.showTip(this, "warning", "EDIT FAILED!");
              }
              break;
            case CONST.USER_LOGIN_STATE_NONE:
              Util.noLogonStatusCallBack(this);
              break;
            default:
              Util.showTip(this, "warning", "WRONG CODE!");
              break;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    confirmOrder() {
      let aid = this.address.id;
      this.fullscreenLoading = true;
       this.$http
        .post(HOST + "/users/address/default", {
          key: Rsa.encryptRsa(this.$store.state.user.key),
          id: Rsa.encryptRsa(this.$store.state.user.id),
          aid: Rsa.encryptRsa(aid),
        })
        .then(response => {
          this.fullscreenLoading = false;
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
          service_msg = Rsa.decryptRsa(service_msg);
          switch (service_code) {
            case CONST.USERS_ADDRESS_DEFAULT:
              if (result.affectedRows) {
                this.$router.push("/order/temporary");
                Util.showTip(this, "success", "ORDER UPDATE,CONFIRM YOUR ORDER!");

              } else {
                Util.showTip(this, "warning", "EDIT FAILED!");
              }
              break;
            case CONST.USER_LOGIN_STATE_NONE:
              Util.noLogonStatusCallBack(this);
              break;
            default:
              Util.showTip(this, "warning", "WRONG CODE!");
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
    }
  }
};
</script>
 