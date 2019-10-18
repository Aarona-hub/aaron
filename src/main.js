import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from 'components/common/toast'
import VueLazyLoad from 'vue-lazyload'
import FastClick from 'fastclick'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

//1.安装插件（添加购物车成功的 toast 插件）
Vue.use(toast)

//解决移动端 300ms 延迟
FastClick.attach(document.body)

//图片懒加载（插件）  img 标签里 添加属性 v-lazy
Vue.use(VueLazyLoad)

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
