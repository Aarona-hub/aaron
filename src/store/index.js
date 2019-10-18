import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

//1.安装
Vue.use(Vuex)
//2.创建
// mutations 和 actions 放在一起代码很乱 所有把他们抽取到别的 js 文件中
const state = {
  cartList:[]
}
const store = new Vuex.Store({
  state,
  //mutations 唯一的目的就是修改 state 的状态
  //mutations 中的每个方法尽可能完成的事件比较单一
  mutations,
  actions,
  getters
})
//3.挂载
export default store
