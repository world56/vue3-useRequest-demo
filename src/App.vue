<template>
  <div>
    <p>{{ loading }}</p>
    <button @click="run">点击</button>
  </div>
</template>

<script setup lang="ts">
import useRequest from './useRequest'

async function getList(signal: AbortSignal) {
  const res = await fetch(`/post/list`, { signal })
  return res.json()
}

const { data, loading, run, controller } = useRequest(
  async () => {
    controller.value?.abort()
    const res = await getList(controller.value!.signal)
    console.log('@-run', res)
    return res
  },
  {
    manual: true,
    throttleWait: 2000
  }
)
</script>
