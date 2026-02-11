<template>
  <div class="home-product">
    <HomePanel :title="cate.name" v-for="cate in goodsProduct" :key="cate.id">
      <div class="box">
        <RouterLink class="cover" to="/">
          <img v-img-lazy="cate.picture" />
          <strong class="label">
            <span>{{ cate.name }}馆</span>
            <span>{{ cate.saleInfo }}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="good in cate.goods" :key="good.id">
            <GoodsItem :good="good"/>
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>
<script setup>
import HomePanel from '@/views/Home/components/Panel.vue'
import api  from '@/api/homeApi.js'
import GoodsItem from '@/views/Home/components/GoodsItem.vue'
const goodsProduct = ref([])
const getGoodsList = async () => {
  const res = await api.getGoods()
  goodsProduct.value = res.result
}

onMounted(() => getGoodsList())
</script>

<style scoped lang='scss'>

$home-product-height:610px;
$cover-width:240px;
.home-product {
  width: $home-width;
  margin: 0 auto;
  //background: #fff;
  //margin-top: 20px;
  //border-top: 1px solid #e4e4e4;
  //.sub {
  //  margin-bottom: 2px;
  //
  //  a {
  //    padding: 2px 12px;
  //    font-size: 16px;
  //    border-radius: 4px;
  //
  //    &:hover {
  //      background: $yhwColor;
  //      color: #fff;
  //    }
  //
  //    &:last-child {
  //      margin-right: 80px;
  //    }
  //  }
  //}

  .box {
    display: flex;

    .cover {
      width: $cover-width;
      height: $home-product-height;
      margin-right: 10px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover; // 不拉伸图片
      }

      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);

        span {
          text-align: center;

          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, 0.9);
          }

          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }

    //
    ul.goods-list {
      width: calc($home-width - $cover-width - 10px);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      li {
        > a {
          margin: 0 auto;
        }
      }
    }


  }
}
</style>
