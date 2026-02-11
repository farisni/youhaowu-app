import {ref, computed, onMounted} from 'vue'
import { defineStore } from 'pinia'
import api from "@/api/homeApi.js";

export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref([]);

  const getCategory = async () => {
    const resp = await api.getCategory()
    categoryList.value = resp.result;
  }

  onMounted(()=>getCategory())

  return { categoryList, getCategory, }
})
