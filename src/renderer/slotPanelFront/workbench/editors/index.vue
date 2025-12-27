<template>
  <div style="height: 100%; width: 100%;">
    <Button @click = "clickhandler(0)" >tab_1</Button>
    <Button @click = "clickhandler(1)" >tab_2</Button>
    <Button @click = "clickhandler(2)" >tab_2</Button>

    <!-- <TerminalEditor /> -->
    <div
      v-for="(_, index) in termlist" 
      :key="index"
      :ref="(el)=> setRef(el, index)"  
      ref=""
      class="terminal-editor"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref,watch, type Ref } from 'vue'
import { TerminalEditor } from '../../editors/terminalEditor/TerminalEditor';
import { session } from 'electron';
import { EditorSession } from '../../core/editor/EditorSession';

const props = defineProps({
  activeTabId: String,
  editorSessions: Array<EditorSession>
})


// import TerminalEditor from '../../editors/terminalEditor/test.vue'

const termRefs = ref<HTMLElement[]>([])
const sessionIns = ref<number[] | null>(null)
const termlist: Ref<EditorSession[] | null> = ref(null);


const setRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    termRefs.value[index] = el
  } else {
    termRefs.value[index] = null
  }
}



watch(()=>props.editorSessions, (newVal)=>{
  console.log('edidtorSessions changed:', newVal);
  setTimeout(()=>{
    // 其实以 props 传入的 sessions 为索引，但是这里为了测试，直接用 terms 数组来创建终端，因为数量是对应的
    // terms.forEach((el, index)=>{
    //   console.log(props.editorSessions[index]);
    //   props.editorSessions[index].mount(el.value!);
    //   // termlist.push(tmp);
    // })
    termlist.value = [...props.editorSessions];

    // props.editorSessions[0].mount(terms[0].value)
  },0)
}, { deep: true })

let termBuffer: EditorSession | null = null;

const clickhandler = (activeTerm: number) => {
  if(termBuffer != null){
    termBuffer.unmount()
  }
  termlist.value[activeTerm].mount(termRefs.value[activeTerm]);
  termBuffer = termlist.value[activeTerm]
}




// watch(()=>props.activeTabId, (newVal)=>{
//   console.log('activeTabId changed:', newVal);
// })

// const termRef = ref<HTMLElement | null>(null);
// const termRef1 = ref<HTMLElement | null>(null);


// const termlist: Ref<EditorSession[] | null> = ref(null);

// let termBuffer: EditorSession | null = null;


// let clickhandler = (v: number) => {
//   if(termBuffer != null){
//       termBuffer.unmount();
//   }

//   if(v === 0){
//     console.log('0 mount');
//     props.editorSessions[0].mount(termRef.value);
//     termBuffer = props.editorSessions[0]

//   }else{
//     console.log('1 mount');

//     props.editorSessions[1].mount(termRef1.value);
//     termBuffer = props.editorSessions[1]
//   }

// }

// let termBuffer: TerminalEditor | null = null;





onMounted(async()=>{

  
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
