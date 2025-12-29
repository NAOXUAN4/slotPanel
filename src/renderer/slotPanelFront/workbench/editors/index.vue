<template>
  <div class="h-full w-full bg-white/40">
    <!-- <Button @click = "clickhandler(0)" >tab_1</Button>
    <Button @click = "clickhandler(1)" >tab_2</Button>
    <Button @click = "clickhandler(2)" >tab_2</Button> -->

    <!-- <TerminalEditor /> -->
    <div
      v-for="(_, index) in termlist"
      :key="index"
      :ref="el => setRef(el, index)"
      class="terminal-editor"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch, type Ref } from 'vue';
import { TerminalEditor } from '../../editors/terminalEditor/TerminalEditor';
import { EditorSession } from '../../core/editor/EditorSession';

import { useSessionStore } from '../../store/sessionStore';

// import TerminalEditor from '../../editors/terminalEditor/test.vue'

const sessionStore = useSessionStore();
const editorSessions = sessionStore.editorSessions;
const activeSessionId = sessionStore.activeSessionId;

const termRefs = ref<HTMLElement[]>([]);
const termlist: Ref<EditorSession[]> = ref([]);

const setRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    termRefs.value[index] = el;
  } else {
    termRefs.value[index] = null;
  }
};

watch(
  () => editorSessions,
  async newVal => {
    // console.log('editorSessions changed:', newVal);
    termlist.value = [...newVal];
  },
  { deep: true }
);

let termBuffer: EditorSession | null = null;

watch(
  () => sessionStore.activeSessionId,
  newVal => {
    // console.log('activeSessionId changed:', newVal);

    nextTick(() => {
      if (termBuffer != null) {
        termBuffer.unmount();
      }
      const activeIndex = termlist.value.findIndex(session => session.id === newVal);

      if (activeIndex !== -1 && termRefs.value[activeIndex]) {
        termlist.value[activeIndex].mount(termRefs.value[activeIndex]);
        termBuffer = termlist.value[activeIndex];
      } else {
        console.log('Failed to mount terminal: either activeIndex is invalid or termRef not ready');
      }
    });
  },
  { deep: true }
);

const clickhandler = (activeTerm: number) => {
  if (termBuffer != null) {
    termBuffer.unmount();
  }
  termlist.value[activeTerm].mount(termRefs.value[activeTerm]);
  termBuffer = termlist.value[activeTerm];
};

onMounted(async () => {});
</script>

<style scoped></style>
