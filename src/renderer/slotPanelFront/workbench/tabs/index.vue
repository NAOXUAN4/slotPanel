<template>
  <div class="tabs-container">
    <div class="tabs">
      tabs
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
  .tabs-container {
    height: 100%;
    line-height: 100%;
    padding-left: 2%;
    background-color: rgb(255, 85, 85);
  }
  .tabs {
    height: 100%;
    line-height: 100%;
    padding-left: 2%;
    background-color: rgb(255, 85, 85);
  }
</style>