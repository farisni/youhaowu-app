import http from "@/utils/http.js";

export default {
  // 获取订单详情
  getCheckInfo(id) {
    return http.get('/member/order/pre')
  },
  // 创建订单
  createOrder(data) {
    return http.post('/member/order',data);
  },



}
