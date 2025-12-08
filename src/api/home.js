import http from "@/utils/http.js";

export default {
  getCategory() {
    return http.get('/home/category/head')
  }
}
