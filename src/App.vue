<template>
  <div id="app">
    <!--不让 Home 随意销毁掉 包装在 keep-alive中-->
    <!--exclude 排除某一页不 keep-alive-->
    <keep-alive exclude="Detail"><router-view></router-view></keep-alive>
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
  import mainTabBar from 'components/content/mainTabbar/MainTabBar'
  export default {
  name: 'app',
  components: {
    mainTabBar
  }
}
</script>

<style>
@import "assets/css/base.css";
</style>
