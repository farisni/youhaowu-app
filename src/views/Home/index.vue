<template>
  <div class="container">
    <Category/>
    <Banner/>
  </div>
  <NewGoods />
  <HotRecommended />
  <Product />
</template>
<script setup>
import Category from './components/Category.vue'
import Banner from './components/Banner.vue'
import NewGoods from './components/NewGoods.vue'
import HotRecommended from './components/HotRecommend.vue'
import Product from './components/Product.vue'
</script>
<style scoped lang="scss">
.container {
}
</style>
