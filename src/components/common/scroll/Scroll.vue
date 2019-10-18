<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    data () {
      return {
        scroll:null,
      }
    },
    props:{
      probeType: {
        type:Number,
        default:0
      },
      pullUpLoad:{
        type:Boolean,
        default:false
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper,{
        click:true,
        probeType:this.probeType,
        pullUpLoad:this.pullUpLoad
      })

      //监听滚动位置
      if (this.probeType === 2 || this.probeType ===3) {
        this.scroll.on('scroll',position => {
          this.$emit('scroll',position)
        })
      }
      // this.scroll.on('scroll',position => {
      //   // console.log(position)
      //   this.$emit('scroll',position)
      // })

      //上拉加载更多
      this.scroll.on('pullingUp',() => {
          this.$emit('pullingUp')
          // console.log('上拉加载更多');
      })
    },
    methods:{
      //this.scroll && 解决 refresh 函数找不到的问题
      //前面为 null 后面的根本不会执行，所以不会 报错
      //找不到 refresh 的问题
      scrollTo (x,y,time=300) {
         this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x,y,time)
      },
      //为了多次上拉加载封装
      finishPullUp () {
         this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
      },
      refresh () {
        this.scroll && this.scroll.refresh && this.scroll.refresh()
      },
      getSaveY () {
        return this.scroll || this.scroll.y || 0
      }
    },
    watch: {
      data() {
        setTimeout(this.refresh, 20)
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    overflow: hidden;
  }
</style>
