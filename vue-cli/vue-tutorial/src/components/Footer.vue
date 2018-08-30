<template>
    <footer class="common-footer" id="footer">
        <div class="footer-top-outwrap">
            <div class="footer-top">
                <div class="footer-left">
                    <template v-for="(href,key,index) in left_btn">
                        <a class="footer-left-btn" :href="href" :key="key+1">{{key}}</a>
                        <span class="footer-left-btn-divider" :key="key">{{index==2?"":"|"}}</span>
                    </template>
                </div>
                <div class="footer-right">
                    <a class="footer-right-btn" v-for="(val,key) in right_btn" :href="val.href" :key="key">
                        <img class="footer-right-icon" :src="val.img" :alt="key">
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
</template>

<style lang="sass" scoped>

</style>

<script>
import ImgFacebook from '../assets/img/Flat_Social_Style_03/PNG/64/02_facebook.png'
import ImgTwitter from "../assets/img/Flat_Social_Style_03/PNG/64/01_twitter.png"
import ImgInstagram from "../assets/img/Flat_Social_Style_03/PNG/64/10_instagram.png"
import ImgPinterest from "../assets/img/Flat_Social_Style_03/PNG/64/13_pinterest.png"
import ImgGoogle from "../assets/img/Flat_Social_Style_03/PNG/64/14_google+.png"

export default {
    name: 'common-footer',
    data: function () {
        return {
            left_btn: {
                "ABOUT US": "#",
                "CONTACT US": "#",
                "HELP": "#",
            },
            right_btn: {
                "Facebook page": {
                    img: ImgFacebook,
                    href: "#"
                },
                "Twitter profile": {
                    img: ImgTwitter,
                    href: "#"
                },
                "Instagram profile": {
                    img: ImgInstagram,
                    href: "#"
                },
                "Pinterest page": {
                    img: ImgPinterest,
                    href: "#"
                },
                "Google+ page": {
                    img: ImgGoogle,
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
</script>

