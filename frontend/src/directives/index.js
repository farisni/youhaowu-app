// 指令存放
// 懒加载图片
import { useIntersectionObserver } from "@vueuse/core";

export const lazyPlugin = {
  install(app) {
    app.directive('img-lazy', {

      mounted(el, binding) {
        // console.log(el, binding.value)
        const { stop } = useIntersectionObserver(
          el,
          ([{ isIntersecting }]) => {
            // console.log(isIntersecting) // 是否检测到需要加载
            if(isIntersecting) {

              el.src = binding.value
              stop()
            }
          }
        )
      }

    })
  }
}
