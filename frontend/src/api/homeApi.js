import http from "@/utils/http.js";

export default {
  getCategory() {return http.get('/home/category/head')},
  getBanner(distributionSite=1) { return http.get("/home/banner",{params:{distributionSite}})},
  getNewGoods() {return http.get("/home/new")},
  getHot() {return http.get("/home/hot")},
  getGoods(){return http.get('/home/goods')}
}
