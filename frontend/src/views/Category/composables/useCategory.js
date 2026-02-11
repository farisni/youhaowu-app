// 用于封装根据一级分类ID获取商品分类数据
import  api from '@/api/categoryApi.js'

export const useCategory = () => {
  const route = useRoute()
  const categoryData = ref({})
  const getCategory = async (id) => {
    const res = await api.getTopCategory(id)
    categoryData.value = res.result
  }

  onMounted(() => getCategory(route.params.id))

  // 导航守卫：用于解决路由缓存问题
  onBeforeRouteUpdate((to) => {
    // 将要访问的路由id
    getCategory(to.params.id)
  })

  return {
    categoryData
  }
}
