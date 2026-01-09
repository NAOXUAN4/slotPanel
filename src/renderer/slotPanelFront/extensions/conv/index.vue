<template>
  <div class="container">
    <h1>{{ props.id }}</h1>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  id: String,
});
</script>

<style scoped>
.container {
  text-align: center;
  background: linear-gradient(135deg, #06f5b5, rgb(247, 9, 255));
  color: antiquewhite;
}
</style>
