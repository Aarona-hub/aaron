import {ADD_COUNT,ADD_CART} from "./mutations-types";

export default {
  //返回一个 promise 用来 发送 toast 在 detail 中添加到购物车成功后调用
  addCart (context,payload) {
   return new Promise((resolve,reject) => {
     //1.查找之前数组中是否有该商品
     let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
     if (oldProduct) {  //商品的数量加一
       context.commit(ADD_COUNT,oldProduct)
       resolve('商品数量加一')
     } else { //商品的种类加一
       payload.count = 1
       context.commit(ADD_CART,payload)
       resolve('商品种类加一')
     }
   })
  }
}
