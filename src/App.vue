<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar></main-tab-bar>
    <icon></icon>
    <svg-icon></svg-icon>
  </div>
</template>

<script>
  import MainTabBar from 'content/mainTabbar/MainTabBar'
  import Icon from 'content/Icon/Icon.vue'
  import SvgIcon from 'content/Icon/svg.vue'

  export default {
    name: 'app',
    components: {
      MainTabBar,
      Icon,
      SvgIcon
    }
  }
</script>

<style>
  @import "assets/css/base.css";

  #app {
    position: relative;
  }
</style>
