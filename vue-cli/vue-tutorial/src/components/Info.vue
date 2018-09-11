<template>
    <div id="info">
        <h3 class="address"><span class="nomal" v-html="address"></span><span class="strong">{{name}}</span></h3>
        <div class="info-content"  v-loading="loading">
            <div class="clearfix">
                <h4>{{personal}}</h4>
                <div class="input-wrap">
                    <ipt-type-one :Input="NameInput"></ipt-type-one>
                </div>
                <div class="input-wrap">
                    <ipt-type-one :Input="EmailInput"></ipt-type-one>
                </div>
            </div>
            <div class="clearfix">
                <h4>{{change_my_password}}</h4>
                <div class="input-wrap">
                    <ipt-type-one :Input="PwdInput"></ipt-type-one>
                </div>
                <div class="input-wrap">
                    <ipt-type-one :Input="ConfirmPwdInput"></ipt-type-one>
                </div>
            </div>
            <el-button type="primary" class="btn-save" @click="saveFn">{{save}}</el-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.address {
  font-size: 1.3rem;
  height: 45px;
  line-height: 45px;
  font-weight: 300;
  padding-top: 0.5rem;
  color: #555;
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
.info-content {
  padding: 24px;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin-top: 1rem;
  position: relative;
  padding-bottom: 100px;
  h4 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0.5rem 0;
  }
  .input-wrap {
    width: 50%;
    padding-left: 2rem;
    float: left;
    margin-bottom: 20px;
  }
  .btn-save {
    position: absolute;
    bottom: 24px;
    right: 24px;
  }
}
</style>

<script>
import CONST from "../assets/CONST.js";
import InputPlaceholderChange from "./InputPlaceholderChange";
import Encryption from "../assets/Encryption.js";
import { mapState } from "vuex";
import Util from '../assets/Util.js';
let { HOST, REGFOREMAIL } = CONST;
let { encryptRsa, decryptRsa, pwdEncrypt } = Encryption;

export default {
  name: "Info",
  data() {
    return {
      personal: "Personal",
      change_my_password: "Change my password",
      save: "SAVE",
      loading: false,
      address:
        "Account&nbsp;&nbsp;|&nbsp;&nbsp;Settings&nbsp;&nbsp;|&nbsp;&nbsp;",
      name: "Info",
      NameInput: {
        id: "name1",
        name: "name1",
        placeholder: "Name",
        value: this.$store.state.user.name,
        type: "text",
        maxlength: 18
      },
      EmailInput: {
        id: "email1",
        name: "email1",
        placeholder: "Email",
        value: this.$store.state.user.email,
        type: "email",
        maxlength: 32
      },
      PwdInput: {
        id: "pwd1",
        name: "pwd1",
        placeholder: "New password",
        value: "",
        type: "password",
        maxlength: 32
      },
      ConfirmPwdInput: {
        id: "pwd2",
        name: "pwd2",
        placeholder: "Confirm New password",
        value: "",
        type: "password",
        maxlength: 32
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
    showLoading (){
      this.loading = true;
    },
    hideLoading (){
      this.loading = false;
    },
    checkError: function() {
      // no change
      if (
        this.NameInput.value === this.userInfo.name &&
        this.EmailInput.value === this.userInfo.email &&
        this.PwdInput.value === "" &&
        this.ConfirmPwdInput.value === ""
      ) {
        this.$message({
          message: "No Change!",
          type: "warning"
        });
        return false;
      }
      //密码长度限制
      if (
        this.PwdInput.value.length > 0 &&
        (this.PwdInput.value.length < 6 || this.PwdInput.value.length > 18)
      ) {
        this.$message({
          message: "The length of your password needs to be between 6 and 18.",
          type: "warning"
        });
        return false;
      }

      //wrong pwd&&confirmpwd
      if (this.PwdInput.value != this.ConfirmPwdInput.value) {
        this.$message({
          message: "The passwords you entered do not match!",
          type: "warning"
        });
        return false;
      }
      //name length
      if (this.NameInput.value.length < 6 || this.NameInput.value.length > 18) {
        this.$message({
          message: "The length of your name needs to be between 6 and 18.",
          type: "warning"
        });
        return false;
      }
      //email length
      if (!this.EmailInput.value.match(REGFOREMAIL)) {
        this.$message({
          message: "Wrong Email!",
          type: "warning"
        });
        return false;
      }

      return true;
    },
    updateSuccess: function(result) {
      let { user_name, user_email } = result[0];
      this.$store.commit("changeUser", {
        user: {
          name: user_name,
          email: user_email,
          key: this.userInfo.key,
          id: this.userInfo.id
        }
      });
      this.PwdInput.value = "";
      this.ConfirmPwdInput.value = "";
      this.showTip("Modify successfully!", "success");
    },
    updateFn: function(value) {
      let pwd = this.PwdInput.value
        ? encryptRsa(pwdEncrypt(this.PwdInput.value))
        : "";
      this.$http
        .post(HOST + "/users/update", {
          code: encryptRsa(value),
          email: encryptRsa(this.EmailInput.value),
          name: encryptRsa(this.NameInput.value),
          password: pwd,
          key: encryptRsa(this.$store.state.user.key),
          id: encryptRsa(this.$store.state.user.id)
        })
        .then(response => {
          this.hideLoading();
          let { data: { result, service_code, service_msg } } = response;
          result = JSON.parse(decryptRsa(result));
          service_code = decryptRsa(service_code);
          service_msg = decryptRsa(service_msg);
          switch (service_msg) {
            case "USER_UPDATE":
              this.updateSuccess(result);
              break;
            case "USER_LOGIN_STATE_NONE":
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
    showCodeInput: function() {
      this.$prompt("ENTER YOUR CODE FROM EMAIL", "Tip", {
        confirmButtonText: "SURE",
        cancelButtonText: "CANCEL",
        inputPattern: /^[1-9]{1}[0-9]{0,6}$/,
        inputErrorMessage: "Error code!"
      })
        .then(({ value }) => {
          this.showLoading();
          this.updateFn(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancel!"
          });
        });
    },
    saveFn: function() {
      
      if (!this.checkError()) {
        return false;
      }

      this.showLoading();
      //email change
      if (this.EmailInput.value != this.userInfo.email) {
        this.$http
          .post(HOST + "/users/mailcode", {
            email: encryptRsa(this.EmailInput.value),
            key: encryptRsa(this.userInfo.key)
          })
          .then(response => {
            this.hideLoading();
            let { data: { result, service_code, service_msg } } = response;
            result = JSON.parse(decryptRsa(result));
            service_code = decryptRsa(service_code);
            service_msg = decryptRsa(service_msg);
            switch (service_code + "") {
              case "105":
                // PwdInput.value = "";
                // ConfirmPwdInput.value = "";
                this.showCodeInput();
                break; //success
              case "106":
                this.$message({
                  type: "warning",
                  message: "Email has been registered!"
                });
                break; //error email
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
        return;
      }
      this.updateFn("");
    }
  },
  components: {
    "ipt-type-one": InputPlaceholderChange
  }
};
</script>
