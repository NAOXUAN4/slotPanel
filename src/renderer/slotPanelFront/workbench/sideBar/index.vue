<template>
  <div class="side-bar flex h-full flex-col items-center gap-0.5 border border-white/20 pt-2">
    <div
      v-for="item in 5"
      :key="item"
      class="side-bar-item flex h-20 w-full cursor-pointer items-center justify-center bg-transparent"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
onMounted(() => {
  console.log('side bar mounted');
});
</script>

<style scoped></style>
