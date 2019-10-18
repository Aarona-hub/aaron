<template>
  <div id="detail">
    <detail-navbar class="detail-navbar" @itemClick="itemClick"  ref="nav"></detail-navbar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommend" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavbar from './childComps/DetailNavbar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import GoodsList from 'components/content/goods/GoodsList'

  import {debounce} from 'common/until'
  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
  import {itemListennerMixin,backTopMixin} from "common/mixin";
  import Scroll from 'components/common/scroll/Scroll'
  import { mapActions } from 'vuex'

  export default {
    name: "Detail",
    components:{
      DetailNavbar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList
    },
    mixins:[itemListennerMixin,backTopMixin],
    data () {
      return {
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommend:[],
        themTopYs:[],
        getThemTopY:null,
        currentIndex:0
      }
    },
    created () {
      //1.保存传入的 id
      this.iid = this.$route.params.iid
      //2.请求详情数据
      getDetail(this.iid).then(res =>{
        //2.1.据 iid 请求详情数据
        const data = res.result
        //2.2.获取顶部轮播图片
        this.topImages = data.itemInfo.topImages
        //2..3.获取商品的详细信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        //2.4.获取店铺的信息
        this.shop = new Shop(data.shopInfo)
        //2.5.获取商品详情的图片
        this.detailInfo = data.detailInfo
        //2.6.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        //2.7.获取评论信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
      /*
        第一次获取展示的信息的 offsetTop
        值不对 原因：this.$refs.params.$el压根没有渲染
        this.themTopYs = []

        this.themTopYs.push(0)
        this.themTopYs.push(this.$refs.params.$el.offsetTop)
        this.themTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themTopYs.push(this.$refs.recommend.$el.offsetTop)
        console.log(this.themTopYs)

        this.$nextTick(()=>{
          第二次获取
          值不对的原因：图片没有计算在内
          根据最新的数据，对应的dom渲染出来了
          但是图片依然没有加载完（目前获取到的 offsetTop 没有包括图片在内）
          offsetTop 值不对的时候都是因为图片的问题

          this.themTopYs = []

          this.themTopYs.push(0)
          this.themTopYs.push(this.$refs.params.$el.offsetTop)
          this.themTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themTopYs.push(this.$refs.recommend.$el.offsetTop)
          console.log(this.themTopYs)
        })
        */
        // getData ()
      })
      //3.请求推荐数据
      getRecommend().then(res =>{
        this.recommend = res.data.list
  })
      //4 .给getThemTopY 赋值
      this.getThemTopY = debounce(() => {
        this.themTopYs = []
        this.themTopYs.push(0)
        this.themTopYs.push(this.$refs.params.$el.offsetTop)
        this.themTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themTopYs.push(Number.MAX_VALUE)
        // console.log(this, themTopYs);
      },300)
    },
    methods:{
      //映射方法，同理映射计算属性（mapGetters）
      ...mapActions(['addCart']),
      imageLoad () {
        this.$refs.scroll.refresh()
        this.getThemTopY()
      },
      itemClick (index) {
        this.$refs.scroll.scrollTo(0,(-this.themTopYs[index]),200)
        // console.log(index)
      },
      contentScroll (position) {
        // console.log(position)
        //1.获取Y值
        const positionY = -position.y
        //2.positionY 和主题中的值进行对比
        //[0,7938,9120,9452]
        //positionY 在0 和 7938之间，index = 0
        //positionY 在7938 和 9120之间，index = 1
        //positionY 在9120 和 9452之间，index = 2
        //positionY 大于等于 9120时，index = 3
        let length = this.themTopYs.length
        for (let i  = 0;i<length-1;i++) {
          if (this.currentIndex !== i && (positionY >= this.themTopYs[i] && positionY < this.themTopYs[i+1])) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
          // if (this.currentIndex !==i && ((i < length -1 && positionY >= this.themTopYs[i] && positionY < this.themTopYs[i+1]) ||
          //   (i === length - 1 && positionY >= this.themTopYs[i]))){
          //   this.currentIndex = i
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
        }
        this.listenShowBackTop(position)
      },
      addToCart () {
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        // this.$store.dispatch('addCart',product).then(res => {
        //   console.log(res);
        // })
        //用映射来的方法 本质上跟上面的方法一样
        this.addCart(product).then(res => {
          this.$toast.show(res)
        })
      },

    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    height: 100vh;
    background-color: #fff;
  }
  .detail-navbar {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content{
    height: calc(100% - 102px);
    position: relative;
  }
</style>
