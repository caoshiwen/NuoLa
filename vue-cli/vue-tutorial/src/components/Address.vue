<template>
    <div id="address" class="">
        <h3 class="address"><span class="nomal" v-html="address"></span><span class="strong">{{name}}</span></h3>
          <transition-group name="card" class="items-wrap clearfix" tag="div">
              <el-card class="item" v-for="(item,k) in items" :key="item.id" shadow="hover">
                  <h2 class="lable">{{item.label}}</h2>
                  <div class="address-content">
                      {{item.name}}
                      {{item.phone}}
                      <br>
                      {{item.city}}
                      {{item.state}}
                      {{item.country}}
                      <br>
                      {{item.postal_code}}
                      <br>
                      {{item.street_address}}
                  </div>
                  <i class="el-icon-edit-outline cursor-pointer" @click="showEdit(k)"></i>
                  <i class="el-icon-delete cursor-pointer" @click="deleteItem(k)"></i>
              </el-card>
          </transition-group>
        <div class="add-address cursor-pointer" @click="showAdd"><span class="add-spn">+</span>{{add_address}}</div>
        <address-block :AddressBlock="AddressBlock"></address-block>
    </div>
</template>

<style lang="scss" scoped>
// @import url('../assets/scss/reload.scss');
#address {
  // padding-top: 10px;
  position: relative;
  transition: 0.6s all;
}

.address {
  font-size: 1.3rem;
  height: 45px;
  line-height: 45px;
  font-weight: 300;
  padding-top: 0.5rem;
  color: #555;
  clear: both;
}
.items-wrap {
  width: 100%;
  column-count: 2;
  column-gap: 0px;
  position: relative;
  transition: 0.6s all;
  .item {
    display: inline-block;
    margin-top: 4px;
    margin-bottom: 3%;
    width: 94%;
    break-inside: avoid;
    padding-bottom: 3%;
    transition: 0.6s all;
  }
}
.items-wrap {
  // clear: both;
  margin-top: 20px;
}
.item {
  // width: 47%;
  float: left;
  position: relative;
  font-size: 12px;
  line-height: 1.4em;
  letter-spacing: 0.05em;
  .lable {
    font-size: 20px;
    margin-bottom: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 1em;
  }
  .el-icon-edit-outline {
    font-size: 20px;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .el-icon-delete {
    font-size: 20px;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
.nomal {
  float: left;
}
.strong {
  font-size: 2rem;
  color: #333;
  // margin-top: .2rem;
  float: left;
}
.add-address {
  background-color: #1e88e5;
  color: #fff;
  text-transform: uppercase;
  position: absolute;
  right: 3%;
  top: 10px;
  padding: 0 2em;
  font-size: 16px;
  line-height: 40px;
  border-radius: 3px;
  &:hover {
    background-color: #2196f3;
  }
  .add-spn {
    font-size: 30px;
    margin-right: 16px;
    float: left;
  }
}

.card {
  transition: all 1s;
  display: inline-block;
}
.card-enter, .card-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
.card-leave-active {
  display: none;
}
.card-move {
  transition: all 1s;
}
</style>
<style lang="scss">

</style>

<script>
import CONST from "../assets/CONST.js";
import InputPlaceholderChange from "./InputPlaceholderChange";
import Encryption from "../assets/Encryption.js";
import { mapState } from "vuex";
import Util from "../assets/Util.js";
const AddressBlock = () => import("./AddressBlock.vue");
let { HOST, REGFOREMAIL } = CONST;
let { encryptRsa, decryptRsa, pwdEncrypt } = Encryption;

export default {
  name: "Account",
  data() {
    return {
      address:
        "Account&nbsp;&nbsp;|&nbsp;&nbsp;Settings&nbsp;&nbsp;|&nbsp;&nbsp;",
      name: "Address",
      add_address: "ADD ADDRESS",
      items: [],
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
  computed: {
    ...mapState({
      userInfo(state) {
        return state.user;
      }
    })
  },
  methods: {
    showTip: function(message, type) {
      Util.showTip(this, type, message);
    },
    showAdd() {
      if (this.items.length >= 10) {
        this.showTip("UP TO 10 ADDRESSES CAN BE SAVED!", "warning");
        return;
      }
      this.AddressBlock.show = true;
      let save = this.addSave;
      this.changeAddressBlock({
        label: "",
        name: "",
        phone: "",
        street_address: "",
        postal_code: "",
        city: "",
        state: "",
        country: "",
        id: "",
        title: "Add Address",
        save
      });
    },
    showEdit(i) {
      this.AddressBlock.show = true;
      let _this = this;
      let save = this.editSave;
      this.changeAddressBlock({
        title: "Edit Address",
        save,
        ..._this.items[i]
      });
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
    getData() {
      this.$http
        .post(HOST + "/users/address/list", {
          key: encryptRsa(this.$store.state.user.key),
          id: encryptRsa(this.$store.state.user.id)
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(decryptRsa(result));
          service_code = decryptRsa(service_code);
          service_msg = decryptRsa(service_msg);
          switch (service_code) {
            case CONST.USER_ADDRESS:
              this.items = result;
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
    deleteItem(i) {
      let a_id = this.items[i].id;
      this.$http
        .post(HOST + "/users/address/del", {
          key: encryptRsa(this.$store.state.user.key),
          id: encryptRsa(this.$store.state.user.id),
          a_id: encryptRsa(a_id)
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(decryptRsa(result));
          service_code = decryptRsa(service_code);
          service_msg = decryptRsa(service_msg);
          switch (service_code) {
            case CONST.USER_ADDRESS_DEL:
              if (result.affectedRows) {
                this.showTip("DELETE SUCCESS!", "success");
                this.getData();
              } else {
                this.showTip("DELETE FAILED!", "warning");
              }
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
    addSave() {
      if (!this.checkSave()) {
        Util.showTip(this, "warning", "INPUT ERROR!");
        return;
      }
      this.$http
        .post(HOST + "/users/address/add", {
          key: encryptRsa(this.$store.state.user.key),
          id: encryptRsa(this.$store.state.user.id),
          label: encryptRsa(this.AddressBlock.Label.value),
          name: encryptRsa(this.AddressBlock.Name.value),
          phone: encryptRsa(this.AddressBlock.Phone.value),
          city: encryptRsa(this.AddressBlock.City.value),
          state: encryptRsa(this.AddressBlock.State.value),
          country: encryptRsa(this.AddressBlock.Country.value),
          postal_code: encryptRsa(this.AddressBlock.PostalCode.value),
          street_address: encryptRsa(this.AddressBlock.StreetAddress.value)
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(decryptRsa(result));
          service_code = decryptRsa(service_code);
          service_msg = decryptRsa(service_msg);
          switch (service_code) {
            case CONST.USER_ADDRESS_ADD:
              if (result.affectedRows) {
                this.showTip("ADD SUCCESS!", "success");
                this.getData();
                this.AddressBlock.show = false;
              } else {
                this.showTip("ADD FAILED!", "warning");
              }
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
    editSave() {
      if (!this.checkSave()) {
        Util.showTip(this, "warning", "INPUT ERROR!");
        return;
      }
      console.log(encryptRsa(this.AddressBlock.id))
      this.$http
        .post(HOST + "/users/address/edit", {
          key: encryptRsa(this.$store.state.user.key),
          id: encryptRsa(this.$store.state.user.id),
          a_id: encryptRsa(this.AddressBlock.id),
          label: encryptRsa(this.AddressBlock.Label.value),
          name: encryptRsa(this.AddressBlock.Name.value),
          phone: encryptRsa(this.AddressBlock.Phone.value),
          city: encryptRsa(this.AddressBlock.City.value),
          state: encryptRsa(this.AddressBlock.State.value),
          country: encryptRsa(this.AddressBlock.Country.value),
          postal_code: encryptRsa(this.AddressBlock.PostalCode.value),
          street_address: encryptRsa(this.AddressBlock.StreetAddress.value)
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          console.log(decryptRsa(result))
          console.log(decryptRsa(service_code))
          console.log(decryptRsa(service_msg))
          result = JSON.parse(decryptRsa(result));
          service_code = decryptRsa(service_code);
          service_msg = decryptRsa(service_msg);
          switch (service_code) {
            case CONST.USER_ADDRESS_EDIT:
              if (result.affectedRows) {
                this.showTip("EDIT SUCCESS!", "success");
                this.getData();
                this.AddressBlock.show = false;
              } else {
                this.showTip("EDIT FAILED!", "warning");
              }
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
    }
  },
  components: {
    "ipt-type-one": InputPlaceholderChange,
    "address-block": AddressBlock
  },
  mounted() {
    this.getData();
  }
};
</script>
