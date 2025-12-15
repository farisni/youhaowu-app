import http from "@/utils/http.js";

export default {

  findNewCartListAPI(){return http.get('/member/cart')},
  insertCart({skuId, count}){return http.post('/member/cart',{skuId, count})}, // 新增购物车（登录后）
  delCartAPI(ids){return http.delete('/member/cart',{data: {ids}})},// 删除购物车
  mergeCartAPI(data){return http.post('/member/cart/merge',data)},
  updateCartAPI(skuId, data){return http.put(`/member/cart/${skuId}`, data)},

}
