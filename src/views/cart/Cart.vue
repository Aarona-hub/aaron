<template>
  <div class="cart">
    <nav-bar class="navbar"><div slot="center">购物车({{cartLength}})</div></nav-bar>
      <cart-list></cart-list>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartBottomBar from './childComs/CartBottomBar'
  import CartList from './childComs/CartList'

  import { mapGetters} from 'vuex'
  export default {
    name: "Cart",
    components:{
      NavBar,
      CartList,
      CartBottomBar
    },
    computed:{
      ...mapGetters(['cartLength'])
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .navbar {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
