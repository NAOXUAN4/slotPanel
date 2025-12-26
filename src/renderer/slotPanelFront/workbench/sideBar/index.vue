<template> 
  <div class="side-bar bg-[rgba(18,44,93,0.90)] h-full flex flex-col items-center pt-2 gap-0.5">
    <div v-for="item in 5" :key="item" class="side-bar-item w-full h-20 bg-white/20 backdrop-blur-sm flex justify-center items-center cursor-pointer">
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  console.log('side bar mounted')
})
</script>

<style scoped>
</style>