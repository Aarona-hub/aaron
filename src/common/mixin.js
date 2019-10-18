import {POP, NEW, SELL} from "./const";
import {debounce} from "./until";
import BackTop from 'components/content/backTop/BackTop'
export const itemListennerMixin = {
  data () {
    return {
      itemImgListener:null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh,500)
    //监听 item 中 图片加载完成
    //事件总线 $bus 需要在 vue prototype 中注册 （main.js）
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener)
  }
}

export const backTopMixin = {
  components:{
    BackTop
  },
  data () {
    return {
      isShowBackTop:false
    }
  },
  methods:{
    backTopClick () {
      this.$refs.scroll.scrollTo(0,0,500)
    },
    listenShowBackTop (position) {
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      // console.log(this.currentType);
    }
  }
}
