// 封装一级分类轮播相关数据
import api from '@/api/homeApi.js'

export const useBanner = () => {
  const bannerList = ref([])

  const getBanner = async () => {
    const res = await api.getBanner({
      distributionSite: '2'
    })
    // console.log(res)
    bannerList.value = res.result
  }

  onMounted(() => getBanner())

  return {
    bannerList
  }
}
