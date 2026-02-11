<template>
  <div class="home-banner">
    <el-carousel height="500px">
      <el-carousel-item v-for="item in bannerList" :key="item">
        <img :src="item.imgUrl" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import api from '@/api/homeApi.js'
const bannerList = ref([])
const getBanner = async () => {
  const res = await api.getBanner()
  bannerList.value = res.result
}

onMounted(() => getBanner())
</script>

<style scoped lang='scss'>
.home-banner {
  width: calc($home-width - 250px); //
  height: 500px;
  position: absolute;
  left: 250px; // 距离左边让出Category位置 改banner和Category 位置
  top: 0;
  z-index: 98;

  img {
    width: 100%;
    height: 500px;
    object-fit: cover;
  }
}
</style>
