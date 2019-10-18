<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item,index) in titles"
             class="item-title"
             @click="itemClick(index)"
             :class="{active:currentIndex === index}">{{ item }}</div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  export default {
    name: "DetailNavbar",
    components:{
      NavBar
    },
    data () {
      return {
        titles:['商品','参数','评论','推荐'],
        currentIndex:0
      }
    },
    methods:{
      itemClick (index) {
        this.currentIndex = index
        this.$emit('itemClick',index)
      },
      backClick () {
        this.$router.back()
      }
    }
  }
</script>

<style scoped>
  .title {
    display: flex;
    font-size: 13px;
  }
  .item-title {
    flex: 1;
  }
  .back {
    margin-top: 5px;
    margin-left: 3px;
  }
  .active {
    color: var(--color-high-text);
  }
</style>
