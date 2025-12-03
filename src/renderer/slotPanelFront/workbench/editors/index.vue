<template>
  <div style="height: 100%; width: 100%;">
    <!-- <TerminalEditor /> -->
    <div ref="term" id="terminal" class="terminal-editor"/>
    <div ref="term2" id="terminal2" class="terminal-editor"/>

    <BUtton @click = "clickhandler(0)" >tab_1</BUtton>
    <BUtton @click = "clickhandler(1)" >tab_2</BUtton>

  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { TerminalEditor } from '../../editors/terminalEditor/TerminalEditor';


// import TerminalEditor from '../../editors/terminalEditor/test.vue'

const term = ref<HTMLElement | null>(null);
const term2 = ref<HTMLElement | null>(null);
const terms = [term, term2];
const termlist: TerminalEditor[] = [];

let termBuffer: TerminalEditor | null = null;

const clickhandler = (activeTerm: number) => {
  if(termBuffer){
    console.log('bufferid:', termBuffer.id);
    termBuffer.unmount();
  }
  if(termlist && activeTerm<termlist.length){
    console.log(termlist);
    
    console.log('activeBuffer:', termlist[activeTerm].id);
    
    termlist[activeTerm].mount();
    termBuffer = termlist[activeTerm];
  }
  
}

onMounted( async()=>{
  setTimeout(()=>{
    terms.forEach((el, index)=>{
      const tmp = new TerminalEditor(`term_${index}`);
      tmp.create(el.value);
      termlist.push(tmp);
    })
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
