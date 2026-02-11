<template>
  <div class="container">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/category/${filterData.parentId}` }">{{ filterData.parentName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ filterData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--筛选区-->
    <SubFilter @filter-change="filterChange" />
    <div class="sub-container">
      <el-tabs v-model="reqData.sortField" @tab-change="tabChange">
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <!--无限加载-->
      <div class="body" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
        <!-- 商品列表-->
        <GoodsItem v-for="good in  goodsList" :good="good" :key="good.id" />
      </div>
    </div>
  </div>
</template>
<script setup>
import api from '@/api/categoryApi.js'
import GoodsItem from '@/views/Home/components/GoodsItem.vue'
import SubFilter from '@/views/Category/composables/SubFilter.vue'

// 加载中
const loading = ref(false)
// 是否加载完毕
const finished = ref(false)
const route = useRoute()
// 根据ID获取商品一级分类
const filterData = ref({})
const getFilterData = async (id) => {
  const res = await api.getCategoryFilter(id)
  filterData.value = res.result
}

onMounted(() => getFilterData(route.params.id))

// 获取二级商品列表
const goodsList = ref([])
let reqData = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 20,
  sortField: 'publishTime'
})

const getGoodsList = async () => {
  const res = await api.findSubCategoryGoods(reqData.value)
  goodsList.value = res.result.items
}

onMounted(() => getGoodsList())


// 切换筛选条件触发的事件
const tabChange = () => {
  console.log("-----二级类目切换tab----")
  reqData.value.page = 1
  getGoodsList()
}

// 2. 更改筛选组件的筛选数据，重新请求
const filterChange = (filterParams) => {
  console.log("--------二级类目 筛选区数据更改------")
  console.log(filterParams)
  finished.value = false
  // 合并请求参数，保留之前参数
  // 使用深拷贝避免循环引用
  const newReqData = {...JSON.parse(JSON.stringify(reqData.value)),
                      ...filterParams,
                      page:1 }
  reqData.value = newReqData
  goodsList.value = []
  getGoodsList() // 重新加载数据
}

// 在更改了二级分类的时候需要重新加载数据
watch(() => route.params.id, (newVal) => {
  // if (newVal && `/category/sub/${newVal}` === route.path) {
  //   finished.value = false
  //   goodsList.value = [] // 导致列表空的，加载更多组件顶上来，进入可视区，区加载数据
  //   reqData = {
  //     page: 1,
  //     pageSize: 20
  //   }
  // }
})

// 禁止无限加载
const disabled = ref(false)

// 无限加载功能
const load = async () => {
  reqData.value.page++
  const res = await api.findSubCategoryGoods(reqData.value)
  goodsList.value = [...goodsList.value, ...res.result.items]

  if(res.result.items.length < 20) {
    disabled.value = true
  }
}

</script>
<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  margin-top: 30px;
  padding: 10px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}
</style>
