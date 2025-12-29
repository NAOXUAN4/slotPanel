<script setup lang="ts">
// import testapi from './editors/terminalEditor/terminalEditor.vue'
import { X, Minus, Square, SquareStack } from 'lucide-vue-next';
import Workbench from './workbench/index.vue';
import { windowCommandType } from './types/window-types';
import { ref } from 'vue';

const windowIsMaximize = ref<boolean>(false);

const windowBtnHandler = async (state: windowCommandType) => {
  switch (state) {
    case 'maximize':
      const tmp = await (window as any).electronAPI.invoke('sys:maximizeWindow');
      windowIsMaximize.value = tmp.status === 'maximize' ? true : false;
      break;
    case 'minimize':
      await (window as any).electronAPI.invoke('sys:minimizeWindow');
      break;
    case 'close':
      await (window as any).electronAPI.invoke('sys:closeWindow');
      break;
    default:
      break;
  }
};
</script>

<template>
  <div
    class="app-shell relative flex h-screen w-full flex-col overflow-hidden rounded-xl bg-[radial-gradient(circle_at_-10%_-10%,rgba(0,47,167,0.6)_0%,transparent_50%),radial-gradient(circle_at_110%_110%,rgba(34,211,238,0.2)_0%,transparent_60%)] bg-size-[100%_100%,50%_50%] bg-position-[top_left,bottom_right] bg-no-repeat font-mono shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
  >
    <div
      class="title-bar drag-region flex h-10 w-full items-center justify-between border-white/20 bg-white/0 px-4 py-3 font-mono transition-all duration-300 select-none"
    >
      <div class="title-bar-title flex w-7/8 justify-end"></div>
      <div
        class="title-bar-btn no-drag flex w-1/8 justify-end gap-6 pt-1! pr-5! text-[#002FA7] opacity-60"
      >
        <Minus :size="20" @click="windowBtnHandler('minimize')"></Minus>
        <Square
          v-if="!windowIsMaximize"
          :size="18"
          class="pt-0.75!"
          @click="windowBtnHandler('maximize')"
        ></Square>
        <SquareStack
          v-if="windowIsMaximize"
          :size="18"
          class="pt-0.75!"
          @click="windowBtnHandler('maximize')"
        ></SquareStack>
        <X :size="20" class="hover:opacity-100" @click="windowBtnHandler('close')"></X>
      </div>
    </div>
    <div class="body-bar relative flex-1 overflow-hidden">
      <workbench />
    </div>

    <div
      class="footer-bar drag-region bottom-0 flex h-6 w-full items-center justify-between border border-white/80 bg-white/40 px-4! py-3! font-mono text-black select-none"
    >
      footer
    </div>
  </div>
  <!-- <testapi/> -->
</template>

<style>
.drag-region {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}
</style>
