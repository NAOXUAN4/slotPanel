<template>
  <div
    class="side-bar flex h-full flex-col items-center gap-1 border-t border-white/20 p-1! pt-12!"
  >
    <div
      class="side-bar-item flex h-10 w-full cursor-pointer items-center justify-center rounded-lg"
    >
      <Gamepad class="text-text-brand size-6 stroke-[1.5px] opacity-60" />
    </div>
    <div
      class="side-bar-item flex h-10 w-full cursor-pointer items-center justify-center rounded-lg"
    >
      <Terminal class="text-text-brand size-6 stroke-[1.5px] opacity-60" />
    </div>
    <div
      class="side-bar-item flex h-10 w-full cursor-pointer items-center justify-center rounded-lg"
    >
      <AlarmClock class="text-text-brand size-6 stroke-[1.5px] opacity-60" />
    </div>
    <div
      class="side-bar-item flex h-10 w-full cursor-pointer items-center justify-center rounded-lg"
    >
      <Clipboard class="text-text-brand size-6 stroke-[1.5px] opacity-60" />
    </div>
    <div
      class="side-bar-item flex h-10 w-full cursor-pointer items-center justify-center rounded-lg"
    >
      <Carrot class="text-text-brand size-6 stroke-[1.5px] opacity-60" />
    </div>
    <div
      class="side-bar-item flex h-10 w-full cursor-pointer items-center justify-center rounded-lg"
    >
      <Blocks class="text-text-brand size-6 stroke-[1.5px] opacity-60" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { Blocks, Terminal } from 'lucide-vue-next';
import { AlarmClock } from 'lucide-vue-next';
import { Clipboard } from 'lucide-vue-next';
import { Carrot } from 'lucide-vue-next';
import { Gamepad } from 'lucide-vue-next';
onMounted(() => {
  console.log('side bar mounted');
});
</script>

<style scoped></style>
