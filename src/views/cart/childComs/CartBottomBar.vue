<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计:￥{{ totalPrice }}
    </div>
    <div class="total">
      去结算({{totalLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'
  import {mapGetters} from 'vuex'
  export default {
    name: "CartBottomBar",
    components:{
      CheckButton
    },
    computed:{
      ...mapGetters(['cartList']),
      totalPrice () {
        return this.cartList.filter(item => {return item.checked})
                            .reduce((previousValue,item) =>{
                              return previousValue + item.price * item.count
                            },0)
   },
      totalLength () {
        return this.cartList.filter(item => {return item.checked}).length
      },
      isSelectAll () {
        if (this.cartList.length === 0) { return false }
        return !this.cartList.find(item => !item.checked)
      }
    },
    methods:{
      checkClick () {
        if (this.isSelectAll) { //全部选中
          //让他不选中
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    /*bottom: 40px;*/
    background-color: #eee;
    display: flex;
    height: 40px;
    line-height: 40px;
  }
  .check-content {
    display: flex;
    width: 60px;
    margin-left: 10px;
    align-items: center;
    color: black;

  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
  .check-content span{
    margin-left: 8px;
  }
  .price {
    flex: 1;
    margin-left: 30px;
    color: black;
  }
  .total {
    width: 80px;
    color: black;
    background-color: red;
    text-align: center;
  }
</style>
