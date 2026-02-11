import axios from "axios";
import {ElMessage} from "element-plus";
import 'element-plus/theme-chalk/el-message.css'
import { useUserStore } from '@/stores/userStore'
import router from "@/router/index.js";

const http = axios.create({
  baseURL:'http://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout:5000,
})


http.interceptors.request.use(
  (config) => {
    // 请求携带token
    const userStore = useUserStore()
    const token = userStore.userInfo.token
    // 存在token在请求头带上token
    if(token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 请求拦截器
    return config;
  },
  (error) => {
    console.log('请求失败', error);
    return Promise.reject(error);
  }
);

// 返回数据拦截器
http.interceptors.response.use(
  (res) => {
    if (res.status === 200 || res.status === 0) {
      return res.data;
    } else {
      Promise.reject();
    }
  },
  (error) => {
    // 统一错误提示
    ElMessage({type: 'error', message: error.response.data.message})
    // 401 token失效处理
    const userStore = useUserStore()
    // token失效处理
    if(error.response.status === 401) {
      // console.log("******token 失效********")
      userStore.clearUserInfo() // 清除用户失效token信息
      router.push('/login')
    }
    console.log('响应失败', error);

    return Promise.reject(error);
  }
);
export default http;
