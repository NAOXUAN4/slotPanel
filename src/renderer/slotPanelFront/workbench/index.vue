<template>
  <div class="workbench-container">
    <div class="side-bar-container">
      <side-bar />
    </div>
    <div class="tab-container">
      <tabs />
    </div>
    <div class="editor-container">
      <editors :active-tab-id="activeId" :editor-sessions="editorSessions" />
    </div>
  </div>
</template>

<script setup lang="ts"> 
import SideBar from './sideBar/index.vue'
import Editors from './editors/index.vue'


import { TabManager } from '../core/tab/TabManager'
import { EditorSession } from '../core/editor/EditorSession'
import { nextTick, onMounted, ref, markRaw } from 'vue'

const activeId = ref<string | null>(null);
const editorSessions = ref<EditorSession[]>([]);

onMounted(async() => {
  console.log('workbench mounted')
  await nextTick()
  const tabManagerIns: TabManager = new TabManager()
  editorSessions.value.push(markRaw(tabManagerIns.createNewEditor('Terminal')));
  editorSessions.value.push(markRaw(tabManagerIns.createNewEditor('Terminal')));
  editorSessions.value.push(markRaw(tabManagerIns.createNewEditor('Terminal')));
  activeId.value = tabManagerIns.activeId;
  console.log(editorSessions.value);
  

  // setTimeout(()=>{
  //   tabManagerIns.switchToById(sessions.value[0].id);
  //   activeId.value = tabManagerIns.activeId;
  // },1000)

})

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
    overflow: auto;
    position: relative;
  }
</style>
