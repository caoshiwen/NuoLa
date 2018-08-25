// common_nav
let common_nav = {
    template: `
    <nav id="nav" class="common-nav" @mouseleave="navMouseOutFn">
        <div class="nav-innerwrap">
            <div class="nav-left">
                <div class="nav-logo"></div>
                <div class="nav-items">
                    <span class="nav-items-title" :style="{color:children.nowc}" v-for="(children,key,index) in items" @mouseover="navItemsShow(key)">{{key}}</span>
                    <transition name="ts-fade" v-for="(children,key,index) in items" :key="key">
                        <div class="nav-items-list" v-show="key==show_items_list">
                            <div class="nav-items-list-block" v-for="(child,ke,inde) in children.v" :key="ke">
                                <a :href="children.url+ke" class="nav-items-list-block-title" :style="{color:children.c}">{{ke}}</a>
                                <a :href="children.url+chil" class="nav-items-list-block-item" v-for="chil in child" :key="chil">{{chil}}</a>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="nav-right">
                <template v-if="UserObject">
                    <span class="nav-right-btn">{{hi}},{{UserObject.name}}</span>
                    <a class="nav-right-btn" :href="account.url">{{account.word}}</a>
                    <a class="nav-right-btn" href="javascript:void(0);" @click="logoutFn">{{logout.word}}</a>
                </template>
                <template v-else>
                    <a class="nav-right-btn" href="javascript:void(0);" @click="showLogin">{{login.word}}</a>
                    <a class="nav-right-btn" href="javascript:void(0);" @click="register.show = true">{{register.word}}</a>
                </template>
                <a class="nav-right-btn" :href="goods_url">
                    <span class="el-icon-goods"></span>
                    ({{cart_goods}})
                </a>
            </div>
        </div>
        <div class="common-login-block">
            <transition name="fade">
                <div class="outerwrap" v-if="show_login" v-on:click.self="show_login = false">
                    <div class="innerwrap">
                        <h5 class="login-tip">{{login_tip}}</h5>
                        <form action="#" method="POST">
                            <input class="email ipt" name="email" id="email" type="email" :placeholder="email.placeholder" maxlength="32" v-model="email.value">
                            <input class="password ipt" name="password" id="password" type="password" :placeholder="password.placeholder" maxlength="18"
                                v-model="password.value">
                            <p class="forget-pwd-tip">{{forget.tip}}
                                <a class="forget-pwd-click" :href="forget.url"> {{forget.word}} </a>.</p>
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
                    <div class="innerwrap">
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
    `,
    data: function () {
        return {
            items: {
                "SHOP": {
                    url: "#",
                    v: {
                        "CLOTHING": ["Legging", "Yoga Leggings", "Capris", "Yoga Capris", "Shorts"],
                        "PILLOW CASES": ["18\" x 18\" Pillow Case", "22\" x 22\" Pillow Case",
                            "24\" x 24\" Pillow Case", "20\" x 24\" Pillow Case"
                        ]
                    },
                    c: "#ec407a",
                    nowc: "#fff"
                },
                "CREATE": {
                    url: "#",
                    v: {
                        "CLOTHING": ["Legging", "Yoga Leggings", "Capris", "Yoga Capris", "Shorts"],
                        "PILLOW CASES": ["18\" x 18\" Pillow Case", "22\" x 22\" Pillow Case",
                            "24\" x 24\" Pillow Case", "20\" x 24\" Pillow Case"
                        ]
                    },
                    c: "#1e88e5",
                    nowc: "#fff"
                }
            },
            show_items_list: "",
            common_c: "#fff",
            cart_goods: 0,
            hi: "Hi",
            account: {
                url: "#",
                word: "MY ACCOUNT"
            },
            goods_url: "#",
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
                url: "#"
            },
            logout: {
                word: "LOGOUT"
            },
            close: "CLOSE",
            user_session: sessionStorage.user, //监听sessionStorage 变化的中间值

            register: {
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
    methods: {
        navItemsShow: function (key) {
            this.navMouseOutFn();
            this.show_items_list = key;
            this.items[key].nowc = this.items[key].c;
        },
        navMouseOutFn: function () {
            this.show_items_list = "";
            for (let key in this.items) {
                this.items[key].nowc = this.common_c;
            }
        },
        showLogin: function () {
            this.show_login = true;
        },
        loginFN: function () { //login
            let re = this.email.value.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/) &&
                this.password.value.length <= 18 && this.password.value.length > 1;
            if (re) {
                let email = this.email.value,
                    password = this.password.value;
                axios.post("/users/login", {
                    email,
                    password,
                }).then(response => {
                    let {
                        data: {
                            result,
                            service_code
                        }
                    } = response;
                    if (result.length > 0) {
                        let _user = {};
                        _user.name = result[0].user_name;
                        _user.id = result[0].user_id;
                        _user.email = result[0].user_email;
                        _user.phone = result[0].user_phone;
                        sessionStorage.user = JSON.stringify(_user);
                        this.user_session = sessionStorage.user;
                        this.user = _user;
                        this.show_login = false;
                        this.$message({
                            message: `Hi, ${_user.name}.Welcome to Log on.`,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: 'Wrong account or password!',
                            type: 'warning'
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            } else {
                this.$message({
                    message: 'Please input correct Email and password!',
                    type: 'warning'
                });
            }
        },
        logoutFn: function () { //logout
            axios.get("/users/logout").then(response => {
                this.user_session = "";
                sessionStorage.removeItem("user");
                this.$message({
                    message: "Successfully logged off!",
                    type: "success"
                });
            }).catch(err => {
                console.log(err);
            });
        },
        registerFN: function () {
            let re = this.register.email.value.match(
                    /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/) &&
                this.register.password.value.length <= 18 &&
                this.register.password.value.length >= 6 &&
                this.register.name.value.length <= 18 &&
                this.register.name.value.length >= 6 &&
                this.register.email_code.value.length <= 6;
            if (re) {
                let email = this.register.email.value,
                    password = this.register.password.value,
                    name = this.register.name.value,
                    mail_code = this.register.email_code.value;
                axios.post("/users/register", {
                    email,
                    password,
                    name,
                    mail_code
                }).then(response => {
                    let {
                        data: {
                            result,
                            service_code
                        }
                    } = response;
                    if (result.length > 0) {
                        let _user = {};
                        _user.name = result[0].user_name;
                        _user.id = result[0].user_id;
                        _user.email = result[0].user_email;
                        sessionStorage.user = JSON.stringify(_user);
                        this.user_session = sessionStorage.user;
                        this.register.show = false;
                        this.$message({
                            message: `Hi, ${_user.name}.Welcome to Log on.`,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: `Code or email is wrong!`,
                            type: 'warning'
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            } else {
                let msg = "Please check your input:";
                switch (false) {
                    case this.register.email.value.match(
                        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/):
                        msg += "The Email address is wrong."
                        break;
                    case this.register.password.value.length <= 18 && this.register.password.value.length >=
                    6:
                        msg += "The length of your password should be between 6 and 18."
                        break;
                    case this.register.name.value.length <= 18 && this.register.name.value.length >=
                    6:
                        msg += "The length of your name should be between 6 and 18."
                        break;
                    case this.register.email_code.value.length <= 6:
                        msg += "Wrong code!"
                        break;
                }
                this.$message({
                    message: msg,
                    type: 'warning'
                });
            }
        },
        setMailCodeInterval: function () {
            clearInterval(this.register.email_code.click.o);
            this.register.email_code.click.o = setInterval(() => {
                if (this.register.email_code.click.rest_click == 0) {
                    clearInterval(this.register.email_code.click.o);
                    this.register.email_code.click.word = this.register.email_code.click.WORD;
                    this.register.email_code.click.click_able = "inherit";
                    return;
                }
                this.register.email_code.click.click_able = "none";
                this.register.email_code.click.word = this.register.email_code.click.REST_WROD +
                    " " + this.register.email_code.click.rest_click-- + "s";
            }, 1000);
        },
        getMailCode: function () {
            let re = this.register.email.value.match(
                /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
            if (re) {
                let email = this.register.email.value;
                axios.post("/users/mailcode", {
                    email
                }).then(response => {
                    let {
                        data: {
                            result,
                            service_code,
                            service_msg
                        }
                    } = response;
                    if (service_msg === "USER_GET_MAIL_ACTIVATE_CODE") {
                        this.$message({
                            message: `Your verification code has been sent to your mailbox. Please check it.`,
                            type: 'success'
                        });
                        // start countdown 60s
                        this.register.email_code.click.last_click = new Date().getTime();
                        this.register.email_code.click.click_able = "none";
                        localStorage.last_click = this.register.email_code.click.last_click;
                        this.register.email_code.click.rest_click = 60;
                        this.setMailCodeInterval();

                    } else if (service_msg === "USER_CHECK_EMAIL_ONLY") {
                        this.$message({
                            message: 'The email account you entered has been registered.Please change it.',
                            type: 'warning'
                        });
                    }
                }).catch(error => {
                    console.log(error);
                });
            } else {
                this.$message({
                    message: 'Please input correct Email!',
                    type: 'warning'
                });
            }
        }
    },
    computed: {
        loginDisable: function () { //login btn useful
            // return !(this.password.value && this.email.value);
            return false;
        },
        UserObject: function () {
            if (this.user_session && this.user_session === sessionStorage.user) {
                let _user = JSON.parse(sessionStorage.user);
                return _user;
            } else {
                return null;
            }
        },
        getCodeClickAble: function () {
            let dt = new Date().getTime();
            if (!localStorage.last_click || dt - localStorage.last_click > 60 * 1000) {
                this.register.email_code.click.word = this.register.email_code.click.WORD;
                this.register.email_code.click.click_able = "inherit";
            } else {
                this.register.email_code.click.rest_click = Math.ceil(60 - (dt - localStorage.last_click) /
                    1000);
                this.register.email_code.click.click_able = "none";
                this.setMailCodeInterval();
            }
            return this.register.email_code.click.local_last_click;
        }
    },
    components: {}
}
//common_footer
let common_footer = {
    template: `
    <footer class="common-footer" id="footer">
        <div class="footer-top-outwrap">
            <div class="footer-top">
                <div class="footer-left">
                    <template v-for="(href,key,index) in left_btn">
                        <a class="footer-left-btn" :href="href">{{key}}</a>
                        <span class="footer-left-btn-divider">{{index==2?"":"|"}}</span>
                    </template>
                </div>
                <div class="footer-right">
                    <a class="footer-right-btn" v-for="(val,key,index) in right_btn" :href="val.href">
                        <img class="footer-right-icon" :src="val.img_url" :alt="key">
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom-outwrap">
            <div class="footer-bottom">
                © 2018 诺拉服饰. All rights reserved.
                <a class="footer-btn" :href="other_url['Terms of Service']">Terms of Service</a> |
                <a class="footer-btn" :href="other_url['Privacy Policy']">Privacy Policy</a>
            </div>
        </div>
    </footer>
    `,
    data: function () {
        return {
            left_btn: {
                "ABOUT US": "#",
                "CONTACT US": "#",
                "HELP": "#",
            },
            right_btn: {
                "Facebook page": {
                    img_url: "img/Flat_Social_Style_03/PNG/64/02_facebook.png",
                    href: "#"
                },
                "Twitter profile": {
                    img_url: "img/Flat_Social_Style_03/PNG/64/01_twitter.png",
                    href: "#"
                },
                "Instagram profile": {
                    img_url: "img/Flat_Social_Style_03/PNG/64/10_instagram.png",
                    href: "#"
                },
                "Pinterest page": {
                    img_url: "img/Flat_Social_Style_03/PNG/64/13_pinterest.png",
                    href: "#"
                },
                "Google+ page": {
                    img_url: "img/Flat_Social_Style_03/PNG/64/14_google+.png",
                    href: "#"
                },
            },
            other_url: {
                "Terms of Service": "#",
                "Privacy Policy": "#"
            }
        };
    },
}