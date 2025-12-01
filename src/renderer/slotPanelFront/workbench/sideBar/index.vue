<template> 
  <div class="side-bar">
    <div v-for="item in 5" :key="item" class="side-bar-item">
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
  .side-bar {
    height: 100%;
    width: 100%;
    background-color: #1500ff;
  }
  .side-bar-item {
    height: 20%;
    padding-left: 2%;
    background-color: #09c306;
  }
</style>