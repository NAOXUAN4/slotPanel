<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
const pushData = ref<any>(null)

let removeListener: (() => void) | undefined

// test invokes
async function callMain() {
  /// test shell:exec
  try{
    // 传递命令、参数和选项
    const result = await (window as any).electronAPI.invoke('shell:exec', 'npm -v');
    console.log('命令执行结果:', result);
  }catch (e) {
    console.warn('RC 调用失败：', e);
  }
}

onMounted(() => {
  const api = (window as any).electronAPI
  if (api?.on) {

    removeListener = api.on('shell:stdout', (data: any)=>{
      console.log('shell:stdout :', data);
      
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