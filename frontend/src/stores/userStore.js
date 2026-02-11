import api from '@/api/loginApi.js'
import cartApi from '@/api/cartApi'
import {useCartStore} from '@/stores/cartStore'

export const useUserStore = defineStore(
  'user',
  // 回调
  () => {
    // 获取用户数据 ref是响应式数据
    const userInfo = ref({})

    // 获取购物车存储实例对象
    const cartStore = useCartStore()

    // 定义获取用户数据方法
    const getUserInfo = async (data) => {
      const res = await api.login(data)
      userInfo.value = res.result

      //合并购物车
      await cartApi.mergeCart(cartStore.cartList.map(item => {
        return {
          skuId: item.skuId,
          selected: item.selected,
          count: item.count
        }
      }))

      //更新购物车列表
      cartStore.updateLoginCartList()
    }

    // 清除用户信息
    const clearUserInfo = () => {
      userInfo.value = {}
    }

    // 返回数据
    return {
      userInfo, // 会被持久化
      getUserInfo, // 方法不会被持久化
      clearUserInfo // 方法不会被持久化
    }
  },
  {
    // pinia持久化
    persist: true // 持久化的对象是 return {} 中返回的所有响应式数据
  })
