<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
const pushData = ref<any>(null)

let removeListener: (() => void) | undefined

// 在 renderer 中使用（假设 preload 暴露了 window.electronAPI）
async function callMain() {
  try {
    const result = await (window as any).electronAPI.invoke('some-channel', { foo: 1 });
    console.log('从主进程返回：', result);
  } catch (e) {
    console.warn('invoke 调用失败：', e)
  }
}

onMounted(() => {
  const api = (window as any).electronAPI
  if (api?.on) {
    // 注册来自主进程的推送回调，api.on 返回一个用于移除监听的函数（在 preload 中已实现）
    removeListener = api.on('push-from-main', (data: any) => {
      console.log('[HelloWorld] 收到 push-from-main：', data)
      pushData.value = data
    })
  }

  callMain()
})

onBeforeUnmount(() => {
  if (removeListener) removeListener()
})

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
