import http from "@/utils/http.js";

export default {
  getTopCategory(id) {
    return http.get('/category',{params:{id}})
  },
  getCategoryFilter(id) {
    return http.get('/category/sub/filter',{params:{id}})
  },

  /**
   * 获取分类下的商品（带筛选条件）
   */
  findSubCategoryGoods (params) {
    return http.post('/category/goods/temporary', params)
  },


}
