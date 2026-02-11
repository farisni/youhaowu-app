import { useUserStore } from '@/stores/userStore.js'
import api from '@/api/cartApi.js'

export const useCartStore = defineStore('cart', () => {

    // 获取用户信息
  const userStore = useUserStore()
  // 是否登录
  const isLogin = computed(() => userStore.userInfo.token)
  // 获取登录后最新购物车列表
  const updateLoginCartList = async () => {
    const res = await api.findNewCartList() // ok
    cartList.value = res.result
  }


  const cartList = ref([])
  // 添加购物车
  const addCart = async (goods) => {
    const { skuId, count } = goods
    if(isLogin.value) {
      // 登录
      await api.insertCart({ skuId, count }) // ok
      await updateLoginCartList() // ok
    } else {
      // 未登录
      // 判断商品是否在购物车
      const findItem = cartList.value.find(item => goods.skuId === item.skuId)
      if (findItem) {
        findItem.count += goods.count
      } else {
        cartList.value.push(goods)
      }
    }

  }


  // 删除购物车
  const delCart = async (skuId) => {
    if(isLogin.value) {
      // 登录
      await api.delCart([skuId]) //ok
      await updateLoginCartList()
    } else {
      cartList.value = cartList.value.filter(item => item.skuId !== skuId)
    }
  }


  // 清除购物车
  const clearCart = () => {
    cartList.value = []
  }


  // 修改购物车（修改购物车中的数量或者选中状态=>更新数据库）
  const updateCart = async (goods) => {
    const { skuId, count, selected } = goods
    if(isLogin.value) {
      await api.updateCart(skuId, { count, selected }) // ok
    }
  }


  // 全选、取消全选
  const checkAll = (selected) => {
    cartList.value.forEach(item => item.selected = selected)
  }

  // 切换单个复选框时是否全选（判断cartList中的每一个selected是否都为true）
  const isAll = computed(() => cartList.value.every(item => item.selected))


  // 总个数
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))

  // 总价
  const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))

  // 已选择数量
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))

  // 已选择数量的总价
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))



  // todo 临时写在这里
  return {
        // 属性
    cartList,
    allCount,
    allPrice,
    isAll,
    selectedCount,
    selectedPrice,
    // 方法
    addCart,
    delCart,
    checkAll,
    updateLoginCartList,
    clearCart,
    updateCart
  }


},
  {
    // pinia持久化
    persist: true
  }


)

