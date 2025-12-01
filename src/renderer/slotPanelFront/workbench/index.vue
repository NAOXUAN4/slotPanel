<template>
  <div class="workbench-container">
    <div class="side-bar-container">
      <side-bar />
    </div>
    <div class="tab-container">
      <tabs />
    </div>
    <div class="editor-container">
      <editors />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from './tabs/index.vue'
import SideBar from './sideBar/index.vue'
import Editors from './editors/index.vue'
</script>

<style scoped>
  .workbench-container {
      display: grid;
      grid-template:
        "sidebar tabs" 40px
        "sidebar editor" 1fr;
      height: 100vh;
      grid-template-columns: 60px 1fr;
      transition: grid-template-columns 0.3s;
    }

  .side-bar-container {
    grid-area: sidebar;
    background-color: rgb(221, 255, 0);
    overflow: hidden;
  }

  .tab-container {
    grid-area: tabs;
    background-color: rgb(85, 255, 130);
    overflow: hidden;
  }

  .editor-container {
    grid-area: editor;
    background-color: rgb(85, 130, 255);
    overflow: hidden;
  }
</style>
