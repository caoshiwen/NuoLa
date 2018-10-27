<template>
<transition name="address-wrap">
    <div id="address-block" class="address-block" v-show="AddressBlock.show" @click.self="hide">
        <div class="wrap">
            <h2 class="title">{{AddressBlock.title}}</h2>
            <div class="input-wrap label">
                <ipt-type-one class="bgcfafafa" :Input="AddressBlock.Label"></ipt-type-one>
            </div>
            <div class="input-wrap name-phone clearfix">
                <ipt-type-one class="bgcfafafa name" :Input="AddressBlock.Name"></ipt-type-one>
                <ipt-type-one class="bgcfafafa phone" :Input="AddressBlock.Phone"></ipt-type-one>
            </div>
            <div class="input-wrap street-address">
                <ipt-type-one class="bgcfafafa" :Input="AddressBlock.StreetAddress"></ipt-type-one>
            </div>
            <div class="input-wrap clearfix">
                <ipt-type-one class="bgcfafafa postal-code" :Input="AddressBlock.PostalCode"></ipt-type-one>
                <ipt-type-one class="bgcfafafa city" :Input="AddressBlock.City"></ipt-type-one>
            </div>
            <div class="input-wrap clearfix">
                <h3 class="country-label">{{AddressBlock.Country.placeholder}}</h3>
                <el-select class="country" v-model="AddressBlock.Country.value" filterable :placeholder="AddressBlock.Country.placeholder">
                    <el-option
                    v-for="item in AddressBlock.Country.select"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
                <ipt-type-one class="bgcfafafa state" :Input="AddressBlock.State"></ipt-type-one>
            </div>
            <div class="btns">
                <span class="save btn cursor-pointer" @click="AddressBlock.save">{{SAVE}}</span><span class="cancel btn cursor-pointer" @click="hide">{{CANCEL}}</span>
            </div>
        </div>
    </div>
</transition>
</template>

<style lang="scss" scoped>
.address-block {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
.wrap {
  background-color: #fafafa;
  width: 600px;
  height: 560px;
  margin: 100px auto auto;
  padding: 30px 20px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  .title {
      font-size: 28px;
      margin-bottom: 10px;
  }
  .name {
      float: left;
      width: 60%;
      margin-right: 5%;
  }
  .phone {
      float: left;
      width: 35%;
  }
    .postal-code {
      float: left;
      width: 35%;
      margin-right: 5%;
  }
  .city {
      float: left;
      width: 60%;
  }
  .state {
      float: right;
      margin-top: -14px;
      width: 50%;
  }
  .country {
      width: 45%;
  }
  .country-label {
    color: #999;
    font-size: .8em;
  }
}
.input-wrap {
    margin-bottom: 20px;
}
.btn {
    display: block;
    padding: 1em 1.4em;
    float: right;
    margin-top: 50px;
    transition: .6s background-color;
    border-radius: 2px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.14);
    }
}
.save {
    color: #1e88e5;
}
.cancel {
    color: #343434;
}
.address-wrap-enter-active, .address-wrap-leave-active {
  transition: all .5s;
}
.address-wrap-enter, .address-wrap-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
<style lang="scss">
.bgcfafafa {
  input {
    background-color: #fafafa !important;
  }
}
.address-block {
    .el-input {
        background: none!important;
        border-bottom: 1px solid #999;
        
    }
    .el-input__inner {
        background: none!important;
        border: none;
        padding-left: 0;
    }
}
</style>

<script>
const InputPlaceholderChange = () => import("./InputPlaceholderChange.vue");
export default {
  name: "AddressBlock",
  data() {
    return {
        CANCEL: 'CANCEL',
        SAVE: 'SAVE'
    };
  },
  props: ["AddressBlock"],
  computed: {},
  methods: {
    hide() {
      this.AddressBlock.show = false;
    }
  },
  components: {
    "ipt-type-one": InputPlaceholderChange
  }
};
</script>
