<template>
    <div class="top-nav">
        <div class="logo">
            <span class="logo-word">{{logo.word}}</span><span class="version">{{version}}</span>
        </div>
        <div class="hello">
            <span class="hello-word">{{hello.word}}</span>
            <span class="top-time">{{time.now}}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.top-nav {
  height: 100%;
  color: #fff;
  background-color: #333;
  .logo {
    padding-top: 14px;
    padding-left: 30px;
    float: left;
  }
  .logo-word {
    font-size: 28px;
  }
  .version {
    font-size: 14px;
    margin-left: 20px;
  }
  .hello {
      padding-top: 22px;
      padding-right: 30px;
      float: right;
  }
  .hello-word {
      margin-right: 12px;
  }
  .top-time {
    font-size: 14px;
    letter-spacing: 1px;
  }
}
</style>

<script>
import moment from "moment";

export default {
  name: "TopNav",
  data() {
    return {
      logo: {
          word: "RUOLA MAG",
      },
      version: "v1.0.1",
      time: {
        o: 0,
        now: ""
      },
      hello: {
          word: `HELLO, ${this.$store.state.user.name}! `
      }
    };
  },
  methods: {},
  mounted() {
    this.time.o = setInterval(() => {
      this.time.now =  moment().format("MMMM Do YYYY HH:mm:ss.");
    }, 100);
  }
};
</script>
