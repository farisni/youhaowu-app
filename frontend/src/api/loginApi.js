import http from "@/utils/http.js";

export default {
  login({account, password}){
    return http.post('/login',{account, password})
  },
}
