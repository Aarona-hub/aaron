<template>
  <div class="toast" v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
  export default {
    name: "Toast",
    // props:{
    //   isShow:{
    //     type:Boolean,
    //     defaule:false
    //   },
    //   message:{
    //     type:String,
    //     default:''
    //   }
    // },
    data() {
      return {
        message:'',
        isShow:false
      }
    },
    methods:{
      show (message,duration=2000) {
        this.message = message
        this.isShow = true
        setTimeout (() => {
          this.isShow = false
          this.message = ''
        },duration)
      }
    }
  }
</script>

<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 8px 10px;
    z-index: 999;
    color: #fff;
    font-size: 18px;
    background-color: rgba(0,0,0,.75);
  }
</style>
