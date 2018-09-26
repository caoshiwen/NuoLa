<template>
    <div id="footer-wrap" class="footer-wrap">
        © 2018 诺拉服饰. All rights reserved.
        <a class="footer-btn" :href="other_url['Terms of Service']">Terms of Service</a> |
        <a class="footer-btn" :href="other_url['Privacy Policy']">Privacy Policy</a>
    </div>
</template>

<style lang="scss" scoped>
    .footer-wrap {
        width: 100%;
        color: #888;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
        a {
            color: #333;
        }
    }
</style>

<script>
export default {
  name: "Footer",
  data() {
    return {
      other_url: {
        "Terms of Service": "#",
        "Privacy Policy": "#"
      }
    };
  }
};
</script>
