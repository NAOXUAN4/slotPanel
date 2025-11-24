<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps<{ msg: string }>()

let removeListener: (() => void) | undefined
const inputCommand = ref('');

// 在 onMounted 时再获取 DOM 引用，避免模块初始化阶段为 null
const shellOutput = ref<HTMLElement | null>(null)

// test invokes
async function callMain(command: string | { value?: string }) {
  /// test shell:exec
  const cmd = typeof command === 'string' ? command : (command?.value ?? '');
  try{
    // 传递命令、参数和选项
    const result = await (window as any).electronAPI.invoke('shell:exec', cmd);
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
      const newchild = document.createElement('span');
      newchild.textContent = data;
      if (shellOutput.value) shellOutput.value.appendChild(newchild)
    })
  }
})

onBeforeUnmount(() => {
  if (removeListener) removeListener()
})

</script>

<template>
  <div class="card">
    <input type="text" v-model="inputCommand">
    <button @click=callMain(inputCommand)><</button>
    <div class="shellRes" ref="shellOutput">
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>