<template>
    <div id="info">
        <h3 class='address'><span class="nomal" v-html="address"></span><span class="strong">{{name}}</span></h3>
        <div class="info-content">
            <h4>Personal</h4>
            <h4>Change my password</h4>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .address {
        font-size: 1.3rem;
        height: 45px;
        line-height: 45px;
        font-weight: 300;
        padding-top: .5rem;
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
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background-color: #fff;
        margin-top: 1rem;

        h4 {
            font-size: 1.5rem;
            font-weight: 500;
            margin: .5rem 0;
        }
    }
</style>

<script>
export default {
    name: 'Info',
    data () {
        return {
            address: 'Account&nbsp;&nbsp;|&nbsp;&nbsp;Settings&nbsp;&nbsp;|&nbsp;&nbsp;',
            name: 'Info'      
        }
    },
}
</script>
