import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 引入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  server:{port:8632},
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      imports:[
        "vue", // 自动导入
        "vue-router",
        "pinia",
      ],
      // 👇 关键：必须设置 enabled: true
      eslintrc: {
        enabled: true,                 // ← 必须为 true
        filepath: './.eslintrc-auto-import.json', // 默认路径
        globalsPropValue: true,        // 全局变量设为 true（可读写）
      },
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver({importStyle:"sass"})],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/styles/element/index.scss" as *;
        @use "@/styles/var.scss" as *;
        `,
      },
    },
  },
})
