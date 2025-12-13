import http from "@/utils/http.js";

export default {
  getGoodsDetail(id){return http.get('/goods',{params: {id}})}
}
