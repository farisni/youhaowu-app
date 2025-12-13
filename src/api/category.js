import http from "@/utils/http.js";

export default {
  getTopCategory(id) {
    return http.get('/category',{params:{id}})
  },
  getCategoryFilterAPI(id) {
    return http.get('/category/sub/filter',{params:{id}})
  },

  /**
   * @description: 获取导航数据
   * @data {
     categoryId: 1005000 ,
     page: 1,
     pageSize: 20,
     sortField: 'publishTime' | 'orderNum' | 'evaluateNum'
   }
   * @return {*}
   */
// 获取二级分类商品列表
  getSecondCategoryAPI (data){
    return http.post('/category/goods/temporary',data);
  }

}
