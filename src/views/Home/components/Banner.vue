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
import api from '@/api/home.js'
const bannerList = ref([])
const getBanner = async () => {
  const res = await api.getBanner()
  bannerList.value = res.result
}

onMounted(() => getBanner())
</script>

<style scoped lang='scss'>
.home-banner {
  width: 990px;
  height: 500px;
  position: absolute;
  left: 250px;
  top: 0;
  z-index: 98;

  img {
    width: 100%;
    height: 500px;
  }
}
</style>
