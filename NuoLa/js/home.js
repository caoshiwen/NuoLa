let img_hover_bigger;
let ihb_contents;
initDate();


let vm = new Vue({
    el: "#wrap",
    data () {
        return {
            ihb_contents
        }
    },
    components: {
        "common-nav": common_nav,
        "common-footer": common_footer,
        "img-hover-bigger": img_hover_bigger
    }
});
function initDate() {
    // components img-hover-bigger
    img_hover_bigger = {
        data () {
            return {
                
            }
        },
        template:`
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
    //data ihb_contents
    ihb_contents = [{
        img_url: "https://static.artofwhere.net/img/pages/home/device-cases.jpg",
        word: "Device Cases",
        type: "small"
    },{
        img_url: "https://static.artofwhere.net/img/pages/home/bags.jpg",
        word: "Bags",
        type: "small"
    },{
        img_url: "https://static.artofwhere.net/img/pages/home/clothes.jpg",
        word: "Clothes",
        type: "big"
    },{
        img_url: "https://static.artofwhere.net/img/pages/home/notebooks.jpg",
        word: "Notebooks",
        type: "big"
    },{
        img_url: "https://static.artofwhere.net/img/pages/home/pencil-cases.jpg",
        word: "Pencil Cases",
        type: "small"
    },{
        img_url: "https://static.artofwhere.net/img/pages/home/scarves.jpg",
        word: "Scarves",
        type: "small"
    },{
        img_url: "https://static.artofwhere.net/img/pages/home/stationery-cards.jpg",
        word: "Stationery Cards",
        type: "small"
    },{
        img_url: "https://static.artofwhere.net/img/pages/home/pillows.jpg",
        word: "Pillows",
        type: "big"
    },{
        img_url: "https://static.artofwhere.net/img/pages/home/wall-art.jpg",
        word: "Wall Art",
        type: "small"
    },];

}