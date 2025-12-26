<template>
  <div class="h-full pl-2 bg-[rgba(18,44,93,0.90)] flex gap-0.5 overflow-auto">
    <div v-for="item in 3" class="h-full pl-2 bg-white/20 backdrop-blur-sm w-40 min-w-40 flex justify-center items-center cursor-pointer">
      <div class="tab-text min-w-20 p-5 flex justify-center">{{item}}</div>
      <div class="del-sign-container  w-20 flex justify-end pr-1">✖️</div>
    </div>

    <div class="add-sign h-full w-10  flex bg-white/20 backdrop-blur-sm justify-center items-center cursor-pointer">
      +
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  console.log('tabs mounted')
})
</script>

<style scoped>
</style>