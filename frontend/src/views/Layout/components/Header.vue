<template>
  <header class='app-header'>
    <div class="container">
      <RouterLink  to="/" />
      <div class="logo">
        <img src="@/assets/images/youhaowu.svg" alt="">
      </div>
      <ul class="app-header-nav">
        <li class="home">
          <RouterLink to="/">首页</RouterLink>
        </li>
        <li v-for="item in categoryList" :key="item.id">
          <!--`/category/${item.id}`-->
          <RouterLink active-class="active" :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        </li>
      </ul>
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜">
      </div>
       <!--头部购物车 -->
      <HeaderCart />
    </div>
  </header>
</template>
<script setup>
import { useCategoryStore } from '@/stores/category'
import HeaderCart from './HeaderCart.vue'
const categoryStore = useCategoryStore()
const { categoryList } = storeToRefs(categoryStore)


</script>
<style scoped lang='scss'>
.app-header {
  background: #fff;

  .container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 80px;
    margin: 5px auto;
    .logo {
      width: 210px;
      img{
        float: right;
        height: 60px;
        background-color: #ffffff;
      }
    }
  }

  ul.app-header-nav {
    width: 820px;
    display: flex;

    position: relative;
    padding-right: 2px; // 与吸顶的差值
    z-index: 998;
    justify-content: space-evenly;

    li {
      flex: 0 0 calc(100%  /10);
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

  .search {
    width: 180px; // 170px + 10px
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;

    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }

    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }

  .cart {
    width: 50px;

    .curr {
      height: 32px;
      line-height: 32px;
      text-align: center;
      position: relative;
      display: block;

      .icon-cart {
        font-size: 22px;
      }

      em {
        font-style: normal;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1px 6px;
        line-height: 1;
        background: $helpColor;
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        font-family: Arial;
      }
    }
  }
}
</style>
