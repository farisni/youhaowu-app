<template>
  <div class="app-header-sticky" :class="{ show: y > 78 }">
    <div class="container">
      <RouterLink to="/" />
      <img src="@/assets/images/youhaowu.svg" alt="">
      <!-- 导航区域 -->
      <ul class="app-header-nav ">
        <li class="home">
          <RouterLink to="/">首页</RouterLink>
        </li>
        <li v-for="item in categoryList" :key="item.id">
          <RouterLink active-class="active" :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        </li>
      </ul>

      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useScroll } from '@vueuse/core'
import { useCategoryStore } from '@/stores/category'

const { y } = useScroll(window)

const categoryStore = useCategoryStore()
const { categoryList } = storeToRefs(categoryStore)


// import {onMounted, ref} from "vue";
// // import api from "@/api/home"
// // const categoryList = ref([]);
// //
// // const getCategory = async () => {
// //   const resp = await api.getCategory()
// //   categoryList.value = resp.result;
// // }
//
// onMounted(()=>getCategory())

</script>

<style scoped lang='scss'>
$container-height:80px;
.app-header-sticky {
  width: 100%;
  box-sizing: border-box;

  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;  /* 确保导航栏在最前面，不被其他内容遮挡 */
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  // 此处为关键样式!!!
  // 状态一：往上平移自身高度 + 完全透明
  transform: translateY(-100%);
  opacity: 0;

  // 状态二：移除平移 + 完全不透明
  &.show {
    transition: all 0.3s linear;
    transform: none;
    opacity: 1;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px auto;

    > img{
      height: 45px;
    }

  }


  .right {
    width: 220px;
    display: flex;
    text-align: center;
    border-left: 2px solid $mainColor;

    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;

      &:hover {
        color: $mainColor;
      }
    }
  }
}

 ul.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 998;

  li {
    margin-right: 40px;
    width: 38px;
    text-align: center;

    a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;

      &:hover {
        color: $mainColor;
        border-bottom: 1px solid $mainColor;
      }
    }

    .active {
      color: $mainColor;
      border-bottom: 1px solid $mainColor;
    }
  }
}
</style>
