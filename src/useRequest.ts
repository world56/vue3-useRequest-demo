import { getList } from './api'
import { ref, watch, readonly, onMounted } from 'vue'

import type { TypeUseRequestAsyncFn, TypeUseRequestParameters } from './interface'

/**
 * @name throttle 节流
 */
function throttle<R>(fn: Function, delay = 0) {
  let lastTime = 0
  return function (...args: unknown[]) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      let data = fn(...args)
      lastTime = now
      return data as R
    }
  }
}

/**
 * @name debounce 防抖
 */
function debounce<R>(fn: Function, delay = 0) {
  let timerId: number
  let immediately = true
  return function (...args: unknown[]) {
    clearTimeout(timerId)
    return new Promise<R>((resolve) => {
      if (immediately) {
        immediately = false
        resolve(fn(...args))
      } else {
        timerId = setTimeout(() => {
          immediately = true
          resolve(fn(...args))
        }, delay)
      }
    })
  }
}

/**
 * @name useRequest 🚀 网络请求Hooks
 */
function useRequest<T extends TypeUseRequestAsyncFn, R = Awaited<ReturnType<T>>>(
  fn: T,
  params?: TypeUseRequestParameters
) {
  const defaultValue = readonly(params?.defaultValue)

  const loading = ref(false)
  const data = ref<R>(defaultValue)

  const controller = ref(new AbortController())

  async function run(params?: any) {
    try {
      controller.value.abort()
      controller.value = new AbortController()
      // 是否清空上一轮值
      if (params?.clearPrevValue) {
        data.value = defaultValue
      }
      loading.value = true // 更新loading状态
      const res = await fn(params)
      data.value = res
      return res as R
    } catch (error) {
      // 错误埋点
      console.log('@-error', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    // 初始化是否执行
    params?.manual || run()
  })

  const returns = {
    run: params?.throttleWait
      ? throttle<R>(run, params.throttleWait) // 节流
      : params?.debounceWait
        ? debounce<R>(run, params.debounceWait) // 防抖
        : run, // 请求方法
    data,
    loading,
    controller
  }

  watch(params?.refreshDeps || Function, () => returns.run(), { deep: true })

  return returns
}

export default useRequest
