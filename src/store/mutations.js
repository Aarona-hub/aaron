import {ADD_COUNT,ADD_CART} from "./mutations-types";

export default {
  [ADD_COUNT] (state,payload) {
    payload.count += 1
  },
  [ADD_CART] (state,payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}
