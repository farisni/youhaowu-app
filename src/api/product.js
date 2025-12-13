import http from "@/utils/http.js";

export default {
  getGoodsDetail(id){return http.get('/goods',{params: {id}})},
  getHotGoods(id, type, limit = 3){
    return http.get('/goods/hot', { param: {id, type, limit}})}

}
