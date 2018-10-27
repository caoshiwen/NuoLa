<template>
    <div class='ipt-type-one'>
        <label :for='Input.id'>
            <span class='placeholder' :class='{active: isActive}'>{{Input.placeholder}}</span>
            <input autocomplete="off" class='input' :id='Input.id' :name='Input.name' :type='Input.type' :maxlength='Input.maxlength' v-model='Input.value'  @focus.prevent='iptFocusOn' @blur='iptFocusOut'>
        </label>
    </div>
</template>

<style lang='scss' scoped>
    .ipt-type-one {
        position: relative;
        padding-top: 1rem;
        .placeholder {
            position: absolute;
            top: 0;
            left: 0;
            font-size: 1rem;
            color: #999;
            top: 2rem;
            transition: all .2s linear;
            &.active {
                font-size: .8rem;
                top: 0;
            }
        }
        .input {
            border: none;
            outline: none;
            border-bottom: 1px solid #999;
            width: 100%;
            height: 3rem;
        }
    }
</style>

<script>
export default {
    name: 'InputPlaceholderChnage',
    data () {
        return {
            is_fouce_on: false
        }
    },
    props: ['Input'],
    computed: {
        isActive: function() {
            return this.Input.value || this.is_fouce_on;
        }
    },
    methods: {
        iptFocusOn: function() {
            this.is_fouce_on = true;
            return false;
        },
        iptFocusOut: function() {
            this.is_fouce_on = false;
        }
    },
}
</script>
