import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Login from '@/views/Login/index.vue'
import Home from '@/views/Home/index.vue'
import Category from '@/views/Category/index.vue'
import SubCategory from '@/views/Category/composables/SubCategory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { // 一级路由
      path:'/',
      component:Layout,
      children:[{ // 二级路由
        path:'', // 不用加 path， 如果是/ 就是 Home
        component: Home,
      },
        {
          path:'category/:id', // 不用加 "/"
          component: Category
        },
        {
          path: 'category/sub/:id',
          component: SubCategory
        },
      ]

    },
    {// 一级路由
      path:'/login',
      component: Login
    }
  ],
  scrollBehavior() {
    // 滚动条每次刷新回到0位置（开始位置）
    // todo 需要优化，不同页面滚动的起始位置不同
    return {top:0}

  }
})

export default router
