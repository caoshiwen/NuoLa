<template>
    <div class="login-wrap" @keyup.enter="loginFn">
        <el-card class="form-wrap" >
            <h1 class="mag-name">{{mag_name}}</h1>
            <p class="login-tip">{{login_tip}}</p>
            <el-input
                class="ipt"
                :placeholder="account.placeholder"
                prefix-icon="el-icon-date"
                type="text"
                maxlength="18"
                v-model="account.value"
                @keydown.enter="loginFn"
                >
            </el-input>
            <el-input
                class="ipt"
                :placeholder="password.placeholder"
                prefix-icon="el-icon-date"
                type="password"
                maxlength="18"
                v-model="password.value">
            </el-input>
            <el-button class="login-btn" plain @click="loginFn">{{login_btn.word}}</el-button>
        </el-card>
        <footer-c class="footer"></footer-c>
    </div>
</template>

<style lang="scss" scoped>
.login-wrap {
  position: relative;
  height: 100%;
  min-height: 700px;
  .mag-name {
    font-size: 32px;
    // font-weight: 600;
    text-align: center;
    margin-bottom: 10px;
  }
  .login-tip {
    margin-bottom: 30px;
    text-align: center;
    color: #888;
  }
  .form-wrap {
    width: 360px;
    height: 330px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 180px;
    margin: 0 auto;
  }
  .ipt {
    margin-bottom: 20px;
  }
  .login-btn {
    width: 100%;
    margin-top: 20px;
  }
}
</style>

<script>
import Util from "../assets/Util";
import CONST from "../assets/CONST";
import Encryption from "../assets/Encryption";
import Footer from "./Footer";
let { encryptRsa, decryptRsa, pwdEncrypt } = Encryption;
export default {
  name: "login",
  data() {
    return {
      mag_name: "后台管理系统",
      login_tip: "LOGIN RUOLA MAG",
      account: {
        placeholder: "Account",
        value: ""
      },
      password: {
        placeholder: "Password",
        value: ""
      },
      login_btn: {
        word: "LOGIN"
      }
    };
  },
  components: {
    "footer-c": Footer
  },
  methods: {
    getSession() {
      this.$http
        .post(`${CONST.HOST}/users/getSession`, {}, CONST.SESSION_CONFIG_CROS)
        .then(res => {
          console.log(res);
          let { data: { result } } = res;
          result = decryptRsa(result);
          result = JSON.parse(result);
          Util.showTip(this, "success", result[0].name);
        })
        .catch(err => {
          console.log(err);
        });
    },
    loginCheck() {
      return (
        this.password.value.match(CONST.REGFORPASSWORD) &&
        this.account.value.match(CONST.REGFORACCOUNT)
      );
    },
    loginFn() {
      //check
      if (!this.loginCheck()) {
        Util.showTip(this, "warning", "Input error!");
        return true;
      }
      let password = encryptRsa(pwdEncrypt(this.password.value)),
        account = encryptRsa(this.account.value);
      //post
      this.loginPost(password, account);
    },
    loginPost(p, a) {
      let password = p;
      let account = a;
      this.$http
        .post(
          `${CONST.HOST}/users/login`,
          {
            password,
            account
          },
          CONST.SESSION_CONFIG_CROS
        )
        .then(res => {
          let { data: { result, service_code, service_msg } } = res;
          result = JSON.parse(decryptRsa(result));
          service_code = decryptRsa(service_code);
          switch (service_code) {
            case CONST.USER_LOGIN_SUCCESS:
              this.loginSuccess(result);
              break;
            case CONST.USER_LOGIN_ERROR_PASSWORD:
              Util.showTip(this, "warning", "ERROR ACCOUNT OR PASSWORD!");
              break;
            case CONST.USER_LOGIN_INACTIVE:
              Util.showTip(this, "warning", "YOUR ACCOUNT IS NOT AVAILABLE!");
              break;
            default:
              Util.showTip(this, "warning", "UNKNOW ERROR!");
              break;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loginSuccess(result) {
      if (result.length > 0) {
        let user = {};
        user.key = result[0].key;
        user.name = result[0].name;
        this.$store.commit("changeUser", { user });
        Util.showTip(this, "success", `WELECOM COME BACK ${user.name}`);
        this.$router.push("/home");
      } else {
        Util.showTip(this, "warning", "UNKNOW ERROR!");
      }
    }
  },
  mounted() {
    this.$http
      .get(`${CONST.HOST}/users/rsa`, {}, CONST.SESSION_CONFIG_CROS)
      .then(res => {
        let {
          data:{
            rsa
          }
        } = res;
        sessionStorage.rsa = JSON.stringify(rsa);
      })
      .catch(err => {
        Util.showTip(this, "warning", "UNKNOW ERROR!");
      });
  }
};
</script>
