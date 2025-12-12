import http from "@/utils/http.js";

export default {
  getCategory() {return http.get('/home/category/head')},
  getBanner(params) { return http.get("/home/banner")},
  getNewGoods() {return http.get("/home/new")},
  getHot() {return http.get("/home/hot")},
  getGoods(){return http.get('/home/goods')}
}
