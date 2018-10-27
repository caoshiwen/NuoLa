<template>
        <nav id="nav" class="common-nav" @mouseleave="navMouseOutFn">
        <span style="display: none;">{{typesChage}}</span>
        <div class="nav-innerwrap">
            <div class="nav-left">
                <div class="nav-logo"></div>
                <div class="nav-items">
                    <span class="nav-items-title cursor-pointer" :style="{color:children.nowc}" v-for="(children,key) in items" @mouseover="navItemsShow(key)" :key="key">{{key}}</span>
                    <transition name="ts-fade" v-for="(children,key) in items" :key="key">
                        <div class="nav-items-list" v-show="key==show_items_list">
                          <div class="nav-items-list-innerwrap">
                            <div class="nav-items-list-block" v-for="(child,ke) in children.v" :key="ke">
                                <router-link tag="a" :to="children.url+ke" class="nav-items-list-block-title" :style="{color:children.c}" style="">{{ke}}</router-link>
                                <router-link  tag="a" :to="children.url+ke+`/`+chil" class="nav-items-list-block-item" v-for="chil in child" :key="chil">{{chil}}</router-link >
                            </div>
                          </div>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="nav-right">
                <!-- <span style="display: none;">{{UserObject}}</span> -->
                <template v-if="$store.state.user.name">
                    <span class="nav-right-btn">{{hi}},{{$store.state.user.name}}</span>
                    <router-link tag="a" :to="account.url" class="nav-right-btn" >{{account.word}}</router-link>
                    <a class="nav-right-btn" href="javascript:void(0);" @click="logoutFn">{{logout.word}}</a>
                    <router-link tag="a" :to="goods_url" class="nav-right-btn" >
                    <span class="el-icon-goods"></span>
                    ({{cart==-1?0:cart}})
                </router-link>
                </template>
                <template v-else>
                    <a class="nav-right-btn" href="javascript:void(0);" @click="showLogin">{{login.word}}</a>
                    <a class="nav-right-btn" href="javascript:void(0);" @click="register.show = true">{{register.word}}</a>
                </template>

            </div>
        </div>
        <div class="common-login-block" v-loading="login.loading">
            <transition name="fade">
                <div class="outerwrap" v-if="show_login" v-on:click.self="show_login = false">
                    <div class="innerwrap">
                        <h5 class="login-tip">{{login_tip}}</h5>
                        <form action="#" method="POST">
                            <input class="email ipt" name="email" id="email" type="email" :placeholder="email.placeholder" maxlength="32" v-model="email.value">
                            <input class="password ipt" name="password" id="password" type="password" :placeholder="password.placeholder" maxlength="18"
                                v-model="password.value">
                            <p class="forget-pwd-tip">{{forget.tip}}
                                <a class="forget-pwd-click" href="javascript:void(0);" @click="$router.push(forget.url)"> {{forget.word}} </a>.</p>
                            <button class="login" type="submit" :disabled="loginDisable" @click.prevent="loginFN">{{login.word}}</button>
                        </form>
                        <a class="close" href="javascript:void(0);" @click="show_login = false">{{close}}</a>
                    </div>
                </div>
            </transition>
        </div>

        <div class="common-register-block common-login-block">
            <transition name="fade">
                <div class="outerwrap" v-if="register.show" v-on:click.self="register.show = false">
                    <div class="innerwrap"  v-loading="register.loading">
                        <h5 class="login-tip">{{register.tip}}</h5>
                        <form action="#" method="POST">
                            <h6>{{register.email.placeholder}}</h6>
                            <input class="email ipt" name="register_email" id="register_email" type="email" :placeholder="register.email.placeholder"
                                maxlength="32" v-model="register.email.value">
                            <h6>{{register.email_code.placeholder}}.
                                <a href="javascript:void(0);" @click="getMailCode" :style="{pointerEvents:register.email_code.click.click_able}" :my-value="getCodeClickAble">{{register.email_code.click.word}}</a>
                            </h6>
                            <input class="email-code ipt" name="email_code" id="register_email_code" type="text" :placeholder="register.email_code.placeholder"
                                maxlength="6" v-model="register.email_code.value">
                            <h6>{{register.password.placeholder}}</h6>
                            <input class="password ipt" name="register_password" id="register_password" type="password" :placeholder="register.password.placeholder"
                                maxlength="18" v-model="register.password.value">
                            <h6>{{register.name.placeholder}}</h6>
                            <input class="name ipt" name="register_name" id="register_name" type="text" :placeholder="register.name.placeholder" maxlength="18"
                                v-model="register.name.value">
                            <!-- <p class="forget-pwd-tip">{{register.code_tip}}</p> -->
                            <button class="login" type="submit" @click.prevent="registerFN">{{register.word}}</button>
                        </form>
                        <a class="close" href="javascript:void(0);" @click="register.show = false">{{close}}</a>
                    </div>
                </div>
            </transition>
        </div>
    </nav>
</template>

<style lang="scss" scoped>

</style>

<script>
import CONST from "../assets/CONST.js";
import Rsa from "../assets/Encryption.js";
import Util from "../assets/Util.js";

const { HOST, REGFOREMAIL } = CONST;
const { encryptRsa, decryptRsa, pwdEncrypt } = Rsa;

export default {
  name: "common-nav",
  data() {
    return {
      items: {
        SHOP: {
          url: "/shop/",
          v: {},
          c: "#ec407a",
          nowc: "#fff"
        },
        CREATE: {
          url: "/create/",
          v: {},
          c: "#1e88e5",
          nowc: "#fff"
        }
      },
      show_items_list: "",
      common_c: "#fff",
      hi: "Hi",
      account: {
        url: "/account/info",
        word: "MY ACCOUNT"
      },
      goods_url: "/cart",
      show_login: false,
      login_tip: "Login with your email",
      email: {
        placeholder: "Email",
        value: ""
      },
      password: {
        placeholder: "Password",
        value: ""
      },
      forget: {
        tip: "Forgot your password?",
        url: "#",
        word: "Click here"
      },
      login: {
        word: "LOGIN",
        url: "#",
        loading: false
      },
      logout: {
        word: "LOGOUT"
      },
      close: "CLOSE",
      user_storage: Util.getUserStorage(), //监听Storage 变化的中间值

      register: {
        loading: false,
        show: false,
        tip: "Input your email as account",
        code_tip: "",
        word: "REGISTER",
        email: {
          placeholder: "Email",
          value: ""
        },
        password: {
          placeholder: "Password",
          value: ""
        },
        name: {
          placeholder: "Name",
          value: ""
        },
        email_code: {
          placeholder: "Code from this mail",
          value: "",
          click: {
            WORD: "Click get code",
            word: "Click get code",
            REST_WROD: "Click again after",
            click_able: "inherit", //
            last_click: 0,
            local_last_click: localStorage.last_click,
            rest_click: 0,
            o: 0
          }
        }
      }
    };
  },
  created() {
    if (Util.getUserStorage()) {
      let user = JSON.parse(Util.getUserStorage());
      this.$store.commit({ type: "changeUser", user });
    }
  },
  methods: {
    showLoginLoading() {
      this.login.loading = true;
    },
    hideLoginLoading() {
      this.login.loading = false;
    },
    showRegisterLoading() {
      this.register.loading = true;
    },
    hideRegisterLoading() {
      this.register.loading = false;
    },
    navItemsShow: function(key) {
      this.navMouseOutFn();
      this.show_items_list = key;
      this.items[key].nowc = this.items[key].c;
    },
    navMouseOutFn: function() {
      this.show_items_list = "";
      for (let key in this.items) {
        this.items[key].nowc = this.common_c;
      }
    },
    showLogin: function() {
      this.show_login = true;
    },
    loginFN: function() {
      this.showLoginLoading();
      //login
      let re =
        this.email.value.match(REGFOREMAIL) &&
        this.password.value.length <= 18 &&
        this.password.value.length > 1;
      if (re) {
        let email = encryptRsa(this.email.value),
          password = encryptRsa(pwdEncrypt(this.password.value));
        this.$http
          .post(HOST + "/users/login", {
            email,
            password
          })
          .then(response => {
            this.hideLoginLoading();
            let {
              data: { result, service_code }
            } = response;
            result = JSON.parse(decryptRsa(result));
            service_code = decryptRsa(service_code);
            if (result.length > 0) {
              // console.log(result);
              let _user = {};
              _user.name = result[0].user_name;
              _user.id = result[0].user_id;
              _user.email = result[0].user_email;
              _user.phone = result[0].user_phone;
              _user.key = result[0].login_key;
              this.$store.commit("changeUser", {
                user: _user
              });
              // this.user_storage = Util.setUserStorage(JSON.stringify(_user));
              // this.user = _user;
              this.getCart();
              this.show_login = false;
              this.$message({
                message: `Hi, ${_user.name}.Welcome to Log on.`,
                type: "success"
              });
            } else {
              this.$message({
                message: "Wrong account or password!",
                type: "warning"
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        this.$message({
          message: "Please input correct Email and password!",
          type: "warning"
        });
      }
    },
    logoutFn: function() {
      //logout
      this.$http
        .get(HOST + "/users/logout")
        .then(response => {
          this.user_storage = "";
          this.$store.commit("removeUser");
          this.$router.push("/home");
          this.$message({
            message: "Successfully logged off!",
            type: "success"
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    registerFN: function() {
      this.showRegisterLoading();
      let re =
        this.register.email.value.match(REGFOREMAIL) &&
        this.register.password.value.length <= 18 &&
        this.register.password.value.length >= 6 &&
        this.register.name.value.length <= 18 &&
        this.register.name.value.length >= 6 &&
        this.register.email_code.value.length <= 6;
      if (re) {
        let email = encryptRsa(this.register.email.value),
          password = encryptRsa(pwdEncrypt(this.register.password.value)),
          name = encryptRsa(this.register.name.value),
          mail_code = encryptRsa(this.register.email_code.value);
        this.$http
          .post(HOST + "/users/register", {
            email,
            password,
            name,
            mail_code
          })
          .then(response => {
            this.hideRegisterLoading();
            let {
              data: { result, service_code }
            } = response;
            result = JSON.parse(decryptRsa(result));
            service_code = decryptRsa(service_code);
            if (result.length > 0) {
              let _user = {};
              _user.name = result[0].user_name;
              _user.id = result[0].user_id;
              _user.email = result[0].user_email;
              _user.phone = result[0].user_phone;
              _user.key = result[0].login_key;
              this.$store.commit("changeUser", {
                user: _user
              });
              // this.user_storage = Util.setUserStorage(JSON.stringify(_user));
              this.register.show = false;
              this.$message({
                message: `Hi, ${_user.name}.Welcome to Log on.`,
                type: "success"
              });
            } else {
              this.$message({
                message: `Code or email is wrong!`,
                type: "warning"
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        let msg = "Please check your input:";
        switch (false) {
          case this.register.email.value.match(REGFOREMAIL):
            msg += "The Email address is wrong.";
            break;
          case this.register.password.value.length <= 18 &&
            this.register.password.value.length >= 6:
            msg += "The length of your password should be between 6 and 18.";
            break;
          case this.register.name.value.length <= 18 &&
            this.register.name.value.length >= 6:
            msg += "The length of your name should be between 6 and 18.";
            break;
          case this.register.email_code.value.length <= 6:
            msg += "Wrong code!";
            break;
        }
        this.hideRegisterLoading();
        this.$message({
          message: msg,
          type: "warning"
        });
      }
    },
    setMailCodeInterval: function() {
      clearInterval(this.register.email_code.click.o);
      this.register.email_code.click.o = setInterval(() => {
        if (this.register.email_code.click.rest_click == 0) {
          clearInterval(this.register.email_code.click.o);
          this.register.email_code.click.word = this.register.email_code.click.WORD;
          this.register.email_code.click.click_able = "inherit";
          return;
        }
        this.register.email_code.click.click_able = "none";
        this.register.email_code.click.word =
          this.register.email_code.click.REST_WROD +
          " " +
          this.register.email_code.click.rest_click-- +
          "s";
      }, 1000);
    },
    getMailCode: function() {
      // this.getMailCode();
      let re = this.register.email.value.match(REGFOREMAIL);
      if (re) {
        this.showRegisterLoading();
        let email = encryptRsa(this.register.email.value);
        this.$http
          .post(HOST + "/users/mailcode", {
            email
          })
          .then(response => {
            this.hideRegisterLoading();
            let {
              data: { result, service_code, service_msg }
            } = response;
            result = decryptRsa(result);
            service_code = decryptRsa(service_code);
            service_msg = decryptRsa(service_msg);
            if (service_msg === "USER_GET_MAIL_ACTIVATE_CODE") {
              this.$message({
                message: `Your verification code has been sent to your mailbox. Please check it.`,
                type: "success"
              });
              // start countdown 60s
              this.register.email_code.click.last_click = new Date().getTime();
              this.register.email_code.click.click_able = "none";
              localStorage.last_click = this.register.email_code.click.last_click;
              this.register.email_code.click.rest_click = 60;
              this.setMailCodeInterval();
            } else if (service_msg === "USER_CHECK_EMAIL_ONLY") {
              this.$message({
                message:
                  "The email account you entered has been registered.Please change it.",
                type: "warning"
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        this.$message({
          message: "Please input correct Email!",
          type: "warning"
        });
      }
    },
    getTypes(){
      if (this.$store.state.types) {
        return;
      }
      this.$http
      .post(CONST.HOST + "/product/types", {})
      .then(response => {
        let {
          data: { result, service_code }
        } = response;
        result = JSON.parse(decryptRsa(result));
        service_code = decryptRsa(service_code);
        if (result.length > 0) {
          this.$store.commit("changeTypes",{types:result});
          this.$store.state.types = result;
        } else {
          this.$message({
            message: `SOME ERROR!`,
            type: "warning"
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
    },
    getTypesArray: function() {
      let r = {};
      let types = this.$store.state.types;
      for (const key in types) {
        if (types.hasOwnProperty(key)) {
          const element = types[key];
          if (!r.hasOwnProperty(element.type)) {
            r[element.type] = [];
          }
          r[element.type].push(element.name);
        }
      }
      this.items.SHOP.v = r;
      this.items.CREATE.v = r;
      return r;
    },
    getCart() {
      let user = this.$store.state.user;
      if(!user||!user.key){
        return;
      }
        this.$http
        .post(CONST.HOST + "/cart/num", {
          id: Rsa.encryptRsa(this.$store.state.user.id),
          key: Rsa.encryptRsa(this.$store.state.user.key)
        })
        .then(response => {
          let {
            data: { result, service_code, service_msg }
          } = response;
          result = JSON.parse(Rsa.decryptRsa(result));
          service_code = Rsa.decryptRsa(service_code);
          service_msg = Rsa.decryptRsa(service_msg);
          switch (service_code + "") {
            case CONST.CART_NUM:
              this.$store.commit("getCart",{cart:result[0].num});
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
  computed: {
    loginDisable: function() {
      //login btn useful
      // return !(this.password.value && this.email.value);
      return false;
    },
    UserObject: function() {
      // if (this.user_storage && this.user_storage === Util.getUserStorage()) {
      let _user = JSON.parse(Util.getUserStorage());
      this.$store.commit({ type: "changeUser", user: _user });
      //   // this.$store.state.user = {..._user};
      //   this.$store.state.test = "2";
      //   return _user;
      // } else {
      //   return null;
      // }
      return this.user_storage.name;
    },
    getCodeClickAble: function() {
      let dt = new Date().getTime();
      if (
        !localStorage.last_click ||
        dt - localStorage.last_click > 60 * 1000
      ) {
        this.register.email_code.click.word = this.register.email_code.click.WORD;
        this.register.email_code.click.click_able = "inherit";
      } else {
        this.register.email_code.click.rest_click = Math.ceil(
          60 - (dt - localStorage.last_click) / 1000
        );
        this.register.email_code.click.click_able = "none";
        this.setMailCodeInterval();
      }
      return this.register.email_code.click.local_last_click;
    },
    typesChage() {
      this.getTypesArray();
      return this.$store.state.types;
    },
    cart() {
      return this.$store.state.cart;
    }
  },
  watch: {
    
  },
  mounted() {
    this.getTypes();
    if(this.$store.state.cart==-1) {
      this.getCart();
    }
  }
};
</script>
