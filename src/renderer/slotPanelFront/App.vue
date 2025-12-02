<script setup lang="ts">
// import testapi from './editors/terminalEditor/terminalEditor.vue'
import Workbench from './workbench/index.vue'
</script>

<template>
  <!-- <testapi/> -->
  <workbench/>
</template>

<style>
.xterm-helper-textarea {
  position: absolute !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  left: 0 !important;
  top: 0 !important;
  z-index: -1 !important;
  pointer-events: none !important;
  caret-color: transparent !important;
}
</style>
