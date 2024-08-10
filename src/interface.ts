import { watch } from 'vue'

import type { Ref } from 'vue'

/**
 * @name TypeUseRequestAsyncFn 第一个参数 传递的异步函数
 */
export type TypeUseRequestAsyncFn<T = any> = (...args: any[]) => Promise<T>

/**
 * @name TypeUseRequestParameters 第二个参数 相关配置
 */
export type TypeUseRequestParameters = Partial<{
  /**
   * @param manual 初始化请求一次
   * @default false
   */
  manual: boolean
  /**
   * @param throttleWait 节流执行时间（毫秒）
   * @description 传递值后生效
   */
  throttleWait: number
  /**
   * @param debounceWait 防抖执行时间（毫秒）
   * @description 传递值后生效
   */
  debounceWait: number
  /**
   * @param clearPrevValue 清空上一轮值为默认值
   * @default undefined
   * @description 若执行run方法，则立即清空data的值为默认值（defaultValue）
   */
  clearPrevValue: boolean
  /**
   * @param defaultValue 默认值
   * @default undefined
   * @description 若执行run方法，则立即清空data的值为默认值（defaultValue）
   */
  defaultValue: any
  /**
   * @name refreshDeps 监听参数，调用run方法
   * @description 跟Vue3 watch API用法完全一致
   */
  refreshDeps: typeof watch
}>

type TypeUseRequest<
  T extends TypeUseRequestAsyncFn = TypeUseRequestAsyncFn,
  R = Awaited<ReturnType<T>>
> = (fn: R) => {
  run: () => Promise<R>
  data: Ref<R>
  loading: Ref<boolean>
}

async function getList() {
  return [1, true, '2']
}

// 得到的结果
// type Returns = (fn: (string | number | boolean)[]) => {
//   run: () => (string | number | boolean)[];
//   data: Ref<(string | number | boolean)[]>;
//   loading: Ref<boolean>;
type Returns = TypeUseRequest<typeof getList>
