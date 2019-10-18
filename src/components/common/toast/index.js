//封装一个 toast
//用另一种方式 封装组件
import Toast from "./Toast";

const obj = {}

obj.install = function (Vue) {
  // console.log('执行了 install ');
  //1.创建组件构造器
  const toastContrustor = Vue.extend(Toast)
  //2.new 的方式，根据组件构造器，可以创建出来一个组件对象
   const toast = new toastContrustor()
  //3.将组件对象，手动挂载到某一个元素上
  toast.$mount(document.createElement('div'))
  //4.toast.$el 对应的 div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast
}

export default obj
