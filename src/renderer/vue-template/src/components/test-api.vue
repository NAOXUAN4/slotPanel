<script setup lang="ts">
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps<{ msg: string }>()

let removeListener: (() => void) | undefined
const terminalRef = ref<HTMLElement | null>(null);
let terminalInstance: Terminal | null = null;
let fitAddon: FitAddon | null = null;

// test invokes
async function shellInvoke(command: string) {
  try {
    // 传递命令、参数和选项
    const result = await (window as any).electronAPI.invoke('shell:exec', command);
    console.log('命令执行结果:', result);
  } catch (e) {
    console.warn('RC 调用失败：', e);
  }
}

onMounted(() => {
  if (!terminalRef.value) return;

  // 创建终端实例
  terminalInstance = new Terminal({
    rows: 24,
    cols: 80,
    cursorBlink: true,
    theme: {
      background: '#242424',
      foreground: '#ffffff'
    }
  });


  fitAddon = new FitAddon();
  terminalInstance.loadAddon(fitAddon);

  terminalInstance.open(terminalRef.value);
  
  fitAddon.fit();

  terminalInstance.onData((data) => {

    if (data === '\r') { // Enter
      terminalInstance?.write('\n');
    } else if (data === '\u007F') {
      terminalInstance?.write('\b \b');
    } else {
      terminalInstance?.write(data);
    }
  });

  // 发送命令到主进程执行
  terminalInstance.onKey(({ key, domEvent }) => {
    if (domEvent.key === 'Enter') {
      const command = terminalInstance?.buffer.active.getLine(
        terminalInstance.buffer.active.cursorY
      )?.translateToString().trim() || '';
       
      shellInvoke(command);
      terminalInstance?.write('\n$ ');
    }
  });

  // 显示提示符
  terminalInstance.write('Welcome to Terminal!\n$ ');

  const api = (window as any).electronAPI
  if (api?.on) {
    removeListener = api.on('shell:stdout', (data: any) => {
      console.log('shell:stdout :', data);
      terminalInstance?.write(data); /* stream 写入 */
    })
  }
})

onBeforeUnmount(() => {
  if (removeListener) removeListener()
  terminalInstance?.dispose();
})
</script>

<template>
  <div class="card">
    <div id="terminal-container" style="height: 500px; width: 800px;">
      <div ref="terminalRef" style="height: 100%; width: 100%;"></div>
    </div>
  </div>
</template>

<style scoped>
#terminal-container {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.read-the-docs {
  color: #888;
}
</style>