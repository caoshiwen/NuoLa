<template>
  <div id="home" class="home-wrap">
        <!-- video-block -->
        <div class="video-block">
            <div class="video-block-innerbg">
                <p class="video-block-word">{{video_block.word}}</p>
            </div>
            <video class="video-block-video" autoplay="" loop="" muted="" preload="metadata">
                <source :src="video_block.video_mp4" type="video/mp4">
                <source :src="video_block.video_ogv" type="video/ogg">
                <source :src="video_block.video_webm" type="video/webm">
            </video>
        </div>

        <!-- images-block -->
        <div class="images-block">
            <div class="innerwrap">
                <h2 class="images-block-title">{{images_block.title}}</h2>
                <p class="images-block-someword">{{images_block.someword}}</p>
                <div class="images-block-imglist">
                    <img-hover-bigger v-for="content in images_block.ihb_contents" :content="content" :key="content.word"></img-hover-bigger>
                </div>
            </div>
        </div>

        <!-- introduce-1st -->
        <div class="introduce-1st">
            <div class="innerwrap">
                <h2 class="introduce-1st-title">{{introduce_1st.title}}</h2>
                <div class="clearfix">
                    <div class="introduce-1st-item" v-for="item in introduce_1st.items" :key="item.title">
                        <img class="item-img" :src="item.img_url" :alt="item.img_alt">
                        <h6 class="item-title">{{item.title}}</h6>
                        <p class="item-word" v-html="item.word"></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- introduce-2nd -->
        <div class="introduce-2nd">
            <div class="innerwrap">
                <h2 class="introduce-2nd-title">{{introduce_2nd.title}}</h2>
                <div class="introduce-2nd-btns">
                    <a class="introduce-2nd-btn" v-for="btn in introduce_2nd.btns" :href="btn.url" :key="btn.alt">
                        <img class="btn-img" :src="btn.img.url" :alt="btn.img.alt">
                    </a>
                </div>
                <p class="introduce-2nd-word" v-html="introduce_2nd.word"></p>
            </div>
        </div>

        <!-- introduce-design -->
        <div class="introduce-design">
            <img class="introduce-bg" :src="introduce_design.bg.url" :alt="introduce_design.img.url">
            <div class="innerwrap">
                <div class="introduce-img-wrap">
                    <img class="introduce-img" :src="introduce_design.img.url" :alt="introduce_design.img.alt">
                </div>
                <div class="introduce-word">
                    <h2 class="word-title">{{introduce_design.title}}</h2>
                    <p class="word">{{introduce_design.word}}</p>
                    <a class="introduce-try" :href="introduce_design.try.url">{{introduce_design.try.word}}</a>
                </div>
            </div>
        </div>

        <!-- introduce-3rd -->
        <div class="introduce-3rd">
            <div class="innerwrap">
                <h2 class="introduce-3rd-title">{{introduce_3rd.title}}</h2>
                <p class="introduce-3rd-word" v-html="introduce_3rd.word"></p>
            </div>
            <img class="introduce-3rd-bg" :src="introduce_3rd.bg_url">
        </div>

        <!-- introduce-4th -->
        <div class="introduce-4th">
            <div class="innerwarp">
                <h2 class="introduce-4th-title">{{introduce_4th.title}}</h2>
                <p class="introduce-4th-word" v-html="introduce_4th.word"></p>
                <img class="introduce-4th-img" :src="introduce_4th.img.url" :alt="introduce_4th.img.alt">
            </div>
        </div>

        <!-- introduce-5th  -->
        <div class="introduce-5th">
            <div class="innerwrap">
                <h2 class="introduce-5th-title">{{introduce_5th.title}}</h2>
                <p class="introduce-5th-word">{{introduce_5th.word}}</p>
                <div>
                    <input class="introduce-5th-ipt" type="text" :maxlength="introduce_5th.ipt.maxlength" :placeholder="introduce_5th.ipt.placeholder" v-model="introduce_5th.ipt.value">
                    <a class="introduce-5th-btn" :href="introduce_5th.btn.url">{{introduce_5th.btn.word}}</a>
                </div>
                <div class="introduce-5th-tip">
                    <i class="el-icon-success" style="color: #fff;"></i>
                    {{introduce_5th.tip}}
                </div>
            </div>
        </div>
  </div>
</template>

<style scoped>

</style>
<script>
import '../assets/scss/home.scss'
let video_block,
    images_block,
    img_hover_bigger,
    ihb_contents,
    introduce_1st,
    introduce_2nd,
    introduce_design,
    introduce_3rd,
    introduce_4th,
    introduce_5th;
initDate();

export default {
  name: "Home",
      data() {
        return {
            video_block,
            images_block,
            introduce_1st,
            introduce_2nd,
            introduce_3rd,
            introduce_4th,
            introduce_5th,
            introduce_design
        }
    },
    components: {
        "img-hover-bigger": img_hover_bigger
    }
};

function initDate() {
    //data video_block
    video_block = {
        word: "Art of Where is your print-on-demand production house combining amazing quality products, local production, and versatile fulfillment services designed with artists in mind.",
        video_mp4: "https://static.artofwhere.net/img/home-animated/aow-live.mp4",
        video_ogv: "https://static.artofwhere.net/img/home-animated/aow-live.ogv",
        video_webm: "https://static.artofwhere.net/img/home-animated/aow-live.webm",
    };
    //data ihb_contents
    ihb_contents = [{
        img_url: "https://static.artofwhere.net/img/pages/home/device-cases.jpg",
        word: "Device Cases",
        type: "small"
    }, {
        img_url: "https://static.artofwhere.net/img/pages/home/bags.jpg",
        word: "Bags",
        type: "small"
    }, {
        img_url: "https://static.artofwhere.net/img/pages/home/clothes.jpg",
        word: "Clothes",
        type: "big"
    }, {
        img_url: "https://static.artofwhere.net/img/pages/home/notebooks.jpg",
        word: "Notebooks",
        type: "big"
    }, {
        img_url: "https://static.artofwhere.net/img/pages/home/pencil-cases.jpg",
        word: "Pencil Cases",
        type: "small"
    }, {
        img_url: "https://static.artofwhere.net/img/pages/home/scarves.jpg",
        word: "Scarves",
        type: "small"
    }, {
        img_url: "https://static.artofwhere.net/img/pages/home/stationery-cards.jpg",
        word: "Stationery Cards",
        type: "small"
    }, {
        img_url: "https://static.artofwhere.net/img/pages/home/pillows.jpg",
        word: "Pillows",
        type: "big"
    }, {
        img_url: "https://static.artofwhere.net/img/pages/home/wall-art.jpg",
        word: "Wall Art",
        type: "small"
    }, ];

    //data images_block
    images_block = {
        title: "LET'S BUILD YOUR ART-BASED BUSINESS.",
        someword: "On-demand printing of your artwork on our unique products. Expand your product line in minutes.",
        ihb_contents,
    }

    // components img-hover-bigger
    img_hover_bigger = {
        data() {
            return {

            }
        },
        template: `
            <a href="javascript:void(0);" class="ihb-wrap" :class="content.type">
                <div class="ihb-img-wrap">
                    <img class="ihb-img" :src="content.img_url">
                </div>
                <div class="ihb-content-wrap">
                    <p class="ihb-word">{{content.word}}</p>
                </div>
            </a>
        `,
        props: ["content"]

    };

    //data introduce_1st SELL HOW YOU WANT
    introduce_1st = {
        title: "SELL HOW YOU WANT",
        items: [{
            title: "Drop Ship",
            img_url: "https://static.artofwhere.net/img-locale/en-ca/home/sell_by_dropship.svg",
            img_alt: "Your own online store",
            word: "Sell directly to your customer base.<br>Set your prices and build your brand."
        }, {
            title: "Wholesale",
            img_url: "https://static.artofwhere.net/img/home-animated/wholesale.svg",
            img_alt: "Your own online store",
            word: "Benefit from our lowest prices per piece."
        }, {
            title: "In the AOW Stores",
            img_url: "https://static.artofwhere.net/img/home-animated/we_make_it.svg",
            img_alt: "Your own online store",
            word: "Create a store on AOW and <br> earn 25% commission on all sales."
        }, ]
    }

    //data introduce_2nd EASY TO USE INTEGRATIONS
    introduce_2nd = {
        title: "EASY TO USE INTEGRATIONS",
        btns: [{
            url: "#",
            img: {
                url: "https://static.artofwhere.net/img/pages/drop-ship/integration-shopify.svg",
                alt: "Shopify"
            },
        },{
            url: "#",
            img: {
                url: "https://static.artofwhere.net/img/pages/drop-ship/integration-etsy.svg",
                alt: "Etsy"
            },
        },{
            url: "#",
            img: {
                url: "https://static.artofwhere.net/img/pages/drop-ship/integration-woocommerce.svg",
                alt: "Woocommerce"
            },
        },{
            url: "#",
            img: {
                url: "https://static.artofwhere.net/img/pages/drop-ship/integration-bigcommerce.svg",
                alt: "BigCommerce"
            },
        },{
            url: "#",
            img: {
                url: "https://static.artofwhere.net/img/pages/drop-ship/integration-bigcartel.svg",
                alt: "Big Cartel"
            },
        },],
        word: "Streamline your selling and fulfillment with our integrations <br> and spend less time managing and more time making art."
    }

    //data introduce_design
    introduce_design = {
        bg: {
            url: "https://static.artofwhere.net/img/pages/home/3d-grid.svg",
            alt: "Design lab grid"
        },
        img: {
            url: "https://static.artofwhere.net/img-locale/en-ca/home-animated/design-lab.gif",
            alt: "Design lab animation"
        },
        title: "YOU DESIGN IT",
        word: "Create great products in minutes using our 3D design labs.",
        try: {
            url: "#",
            word: "TRY IT NOW"
        }
    }

    //data introduce_3rd WE MAKE IT
    introduce_3rd = {
        title: "WE MAKE IT",
        word: "On demand ethical production.<br> Exceptional prints and amazing quality fabrics.",
        bg_url: "https://static.artofwhere.net/img/home-animated/workshop.jpg"
    }

    // data introduce_4th BUILD YOUR BRAND
    introduce_4th = {
        title: "BUILD YOUR BRAND",
        word: "Make it 100% yours with custom labels and packaging.",
        img: {
            url: "https://static.artofwhere.net/img-locale/en-ca/home/customize-your-brand.svg",
            alt: "Customize your brand"
        }
    }

    // data introduce_5th
    introduce_5th = {
        title: "Create quality products in minutes, and sell them worldwide",
        word: "Art of Where is your on-demand manufacturer of clothing and printed products specializing in drop shipping for art-based businesses. Seamless fulfillment with integrated eCommerce platforms. Realistic product modeling in our 3D labs. Help and support. World wide shipping.",
        ipt: {
            value:"",
            placeholder:"Enter your email address",
            maxlength: 64
        },
        btn: {
            url: "#",
            word: "Sign Up Free"
        },
        tip: "No fees. No credit card. No spam."
    }
}
</script>
