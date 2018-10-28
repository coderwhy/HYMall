<template>
  <div id="nav-bar">
    <div class="nav-left"><slot name="left"></slot></div>
    <div class="nav-center"><slot name="center">标题</slot></div>
    <div class="nav-right"><slot name="right"></slot></div>
  </div>
</template>

<script>
	export default {
		name: "NavBar"
	}
</script>

<style scoped>
  #nav-bar {
    position: relative;
    z-index: 10;

    display: flex;

    height: 44px;
    line-height: 44px;
    text-align: center;

    /*border-bottom: 1px solid #eee;*/
    /*box-shadow: 0 1px 1px rgba(100,100,100,.08);*/
  }

  .nav-left {
    width: 60px;
  }

  .nav-center {
    flex: 1;
  }

  .nav-right {
    width: 60px;
  }
</style>
