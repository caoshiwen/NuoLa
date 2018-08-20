
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
                            <div class="nav-items-list-block" v-for="(child,ke,inde) in children.v">
                                <a href="#" class="nav-items-list-block-title" :style="{color:children.c}">{{ke}}</a>
                                <a href="#" class="nav-items-list-block-item" v-for="chil in child">{{chil}}</a>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="nav-right">
                <a class="nav-right-btn" href="#">MY ACCOUNT</a>
                <a class="nav-right-btn" href="#" v-if="login_status === 'LOGIN'">LOGIN</a>
                <a class="nav-right-btn" href="#" v-else>LOGOUT</a>
                <a class="nav-right-btn cart-btn" href="#" title="Cart">
                    <span class="el-icon-goods"></span>
                    ({{cart_goods}})
                </a>
            </div>
        </div>
    </nav>
    `,
    data: function () {
        return {
            items: {
                "商城 SHOP": {
                    v: {
                        "CLOTHING": ["Legging", "Yoga Leggings", "Capris", "Yoga Capris", "Shorts"],
                        "PILLOW CASES": ["18\" x 18\" Pillow Case", "22\" x 22\" Pillow Case", "24\" x 24\" Pillow Case", "20\" x 24\" Pillow Case"]
                    }, c: "#ec407a", nowc: "#fff"
                },
                "设计 CREATE": {
                    v: {
                        "CLOTHING": ["Legging", "Yoga Leggings", "Capris", "Yoga Capris", "Shorts"],
                        "PILLOW CASES": ["18\" x 18\" Pillow Case", "22\" x 22\" Pillow Case", "24\" x 24\" Pillow Case", "20\" x 24\" Pillow Case"]
                    }, c: "#1e88e5", nowc: "#fff"
                }
            },
            show_items_list: "",
            common_c: "#fff",
            login_status: "LOGIN",
            cart_goods: 0
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

        }
    },
    computed: {

    },
    components: {

    }
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
            other_url:{
                "Terms of Service": "#",
                "Privacy Policy": "#"
            }
        };
    },
}