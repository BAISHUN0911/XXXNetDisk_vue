<template>
  <div id="app">
    <div class="menuDiv">
      <Header></Header>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"; //  1. 引入组件
export default{
  name: "App",
  //注册组件
  components: {
    Header,
  },
};
</script>



<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
.menuDiv
  border: 2px solid green
  text-align: center

</style>
