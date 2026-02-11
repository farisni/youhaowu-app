<template>
  <TopFixed />
  <Navigate/>
  <Header/>
  <RouterView /> <!--Layout 下的路由出口（二级路由）-->
  <Footer/>
</template>
<script setup>
import TopFixed from "@/views/Layout/components/TopFixed.vue";
import Navigate from "@/views/Layout/components/Navigate.vue";
import Header from "@/views/Layout/components/Header.vue";
import Footer from "@/views/Layout/components/Footer.vue";
</script>
<style scoped>

</style>
