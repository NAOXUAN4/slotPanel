<template>
  <div style="height: 100%; width: 100%;">
    <!-- <TerminalEditor /> -->
    <div ref="term" id="terminal" class="terminal-editor"/>
    <BUtton @click = "clickhandler" >tab</BUtton>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { TerminalEditor } from '../../editors/terminalEditor/TerminalEditor';


// import TerminalEditor from '../../editors/terminalEditor/test.vue'

const term = ref<HTMLElement | null>(null);
let termins: TerminalEditor = null;

const ismount = ref(false);

const clickhandler = () => {
  if(ismount.value == true){ 
    termins.mount();
  }else{
    termins.unmount();
  }
  ismount.value = !(ismount.value);
}

onMounted( async()=>{
  setTimeout(()=>{
    termins = new TerminalEditor('term1');
    termins.create(term.value);
    termins!.mount();

  },0)

  
})


</script>


<style>
  .terminal-editor {
    position: relative;
    height: 500px;
    width: 800px;
    display: block;
  }


  /* 2. 核心画布区域：必须填满容器 */
  .xterm-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* 3. 视口区域：必须与屏幕重合 */
  .xterm-viewport {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: scroll; /* 启用垂直滚动 */
  }

  /* 4. 文本行容器：必须与屏幕重合 */
  .xterm-rows {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* 5. 隐藏辅助元素，并将其移出文档流 */
  .xterm-helpers,
  .xterm-helper-textarea {
    position: absolute; /* 关键：使其不占正常流空间 */
    opacity: 0;
    left: -9999em; /* 将其移到可视区域外 */
    z-index: -1;
    height: 0; /* 确保其没有高度 */
    overflow: hidden;
}
</style>
