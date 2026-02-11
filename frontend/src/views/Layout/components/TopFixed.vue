<template>
  <!---->
  <div class="app-header-sticky" :class="{ show: y > 78 }" >
    <div class="container">
      <RouterLink to="/" />
      <div class="logo">
        <img src="@/assets/images/youhaowu.svg" alt="">
      </div>
      <!-- 导航区域 -->
      <ul class="app-header-nav ">
        <li class="home">
          <RouterLink to="/">首页</RouterLink>
        </li>
        <li v-for="item in categoryList" :key="item.id">
          <RouterLink active-class="active" :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        </li>
      </ul>
      <span class="division">|</span>
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
$sticky-height:55px;
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
    justify-content: space-around;
    margin: 5px auto;

    .logo {
      width: 210px;
      img {
        float: right;
        height: 45px;
        background-color: #ffffff;
      }
    }

  }

  .division {
    color: $yhwColor;
    width: 5px;
    font-size: 16px;
    font-weight: bold;
  }

  .right {
    height: $sticky-height;
    width: 170px;
    display: flex;
    align-items: center;
    justify-content: center;

    a {
      width: 60px;
      font-size: 16px;
      line-height: 1;

      &:hover {
        color: $yhwColor;
      }
    }
  }
}

 ul.app-header-nav {
  width: 820px;
  display: flex;
  position: relative;

   z-index: 998;

  li {
    flex: 0 0 calc(100%/10);
    //margin-right: 40px;
    //width: 38px;
    text-align: center;

    a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;

      &:hover {
        color: $yhwColor;
        border-bottom: 1px solid $yhwColor;
      }
    }

    .active {
      color: $yhwColor;
      border-bottom: 1px solid $yhwColor;
    }
  }
}
</style>
