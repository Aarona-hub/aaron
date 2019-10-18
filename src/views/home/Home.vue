<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isFixed">
    </tab-control>
    <scroll class="content" ref="scroll"
            :probeType="3"
            :pull-up-load="true"
            @pullingUp="loadMore"
            @scroll="contentScroll">
      <home-swiper :banners="banners" @imageLoad="swiperImageLoad"></home-swiper>
      <recommend-views :recommends="recommends"></recommend-views>
      <feature-views></feature-views>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                    ref="tabControl2">
      </tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendViews from './childComps/RecommendViews'
  import FeatureViews from './childComps/FeatureViews'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata,getHomeGoods} from 'network/home'
  import {itemListennerMixin,backTopMixin} from "common/mixin"
  import {debounce} from "common/until"
  import {getCategory, getSubcategory, getCategoryDetail} from "network/category"

  export default {
    name: "Home",
    //用来保存 请求过来的数据
    data () {
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{type:'pop',page:0,list:[]},
          'new':{type:'new',page:0,list:[]},
          'sell':{type:'sell',page:0,list:[]},
        },
        currentType:'pop',
        tabOffsetTop:0,
        isFixed:false,
        saveY:0
      }
    },
    mixins:[itemListennerMixin,backTopMixin],
    components:{
      HomeSwiper,
      RecommendViews,
      FeatureViews,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    //组件加载完成就开始请求
    created () {
      // getCategory ().then(res => {
      //   console.log(res);
      // })
      //请求多个数据
        this.getHomeMultidata()
      //请求首页 goods
        this.getHomeGoods('pop')
        this.getHomeGoods('new')
        this.getHomeGoods('sell')
    },
    //解决 refresh 找不到函数的问题
    //保留 Home 离开时的状态
    //两面两个记录活跃时和不活跃时
    //变量 saveY 保存滚动高度
    activated () {
      //刷新解决 时而不能滚动，时而自己回到顶部
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated () {
      //1.保存 Y 值
      this.saveY = this.$refs.scroll.getSaveY()
      //2.取消全局事件监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    computed:{
      showGoods () {
        return this.goods[this.currentType].list
      },
    },
    methods:{
      //监听事件相关方法
      tabClick (index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        //为了统一两个 tabcontrol （流行，新款，精选）
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll (position) {
        //监听 回到顶部的显示 隐藏
        this.listenShowBackTop(position)
        //监听 吸顶
        this.isFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore () {
        this.getHomeGoods(this.currentType)
        //图片加载完成，然后调用此方法 刷新 解决 有时不能滚动的问题
        this.$refs.scroll.scroll.refresh()
      },
      swiperImageLoad () {
        //tab-control 吸顶效果
        //所有组件都有都有一个属性 $el:用于获取组件中的元素
        //获取 tabControl 的 offsetTop
        // console.log(this.$refs.tabControl.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop

      },
      //网络请求相关方法
      getHomeMultidata () {
        getHomeMultidata ().then(res => {
          this.banners = res.data.banner.list
          // console.log(res.data.banner.list)
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods (type) {
        const page = this.goods[type].page + 1
        getHomeGoods (type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          //无这句 只能上拉加载一次
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    position: relative;
    height: 100vh;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .content {
    position: absolute;
    left: 0;
    top: 44px;
    right: 0;
    bottom: 49px;
    overflow: hidden;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
