<script setup lang="ts">
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps<{ msg: string }>()
const PROMPT = '$ ';

//收集销毁函数
let removeListeners: Set<(()=> void)> = new Set();
const terminalRef = ref<HTMLElement | null>(null);
let terminalInstance: Terminal | null = null;
let fitAddon: FitAddon | null = null;


// test invokes
async function shellInvoke(command: string) {
  try {
    const result = await (window as any).electronAPI.invoke('shell:exec', command);
    // console.log('shell:exec call', result);
  } catch (e) {
    console.warn('shell:exec err', e);
  }
}

onMounted(() => {
  if (!terminalRef.value) return;

  terminalInstance = new Terminal({
    rows: 24,
    cols: 80,
    cursorBlink: true,
    fontFamily: 'Consolas, Monaco, "Courier New", "Microsoft YaHei", monospace',
    allowTransparency: true,
    scrollback: 1000,
    convertEol: true,
    theme: {
      background: '#242424',
      foreground: '#ffffff'
    }
  });


  fitAddon = new FitAddon();
  terminalInstance.loadAddon(fitAddon);

  terminalInstance.open(terminalRef.value);
  fitAddon.fit();


  // 初始化提示符
  terminalInstance?.write(`\n${PROMPT}`);
  // console.log(terminalInstance.buffer.active.cursorX, terminalInstance.buffer.active.cursorY);


  /**
   * 获取当前行输入
   */
  function getCurrentInput() {
    const buffer = terminalInstance!.buffer.active;
    const cursorY = buffer.cursorY;
    const line = buffer.getLine(cursorY);

    if (!line) return '';

    const text = line.translateToString(); // 当前整行文本

    // 去掉前面的 prompt
    if (text.startsWith(PROMPT)) {
      return text.slice(PROMPT.length);
    }

    return text;
  }

  /**
   * ondata 处理 ctrl + C 
   */
  terminalInstance.onData((data) => {
    // 处理Ctrl+C (\x03)，用于中断当前命令
    if (data === '\x03') {
      terminalInstance?.write(`\r\n${PROMPT}`);
      try {
        (window as any).electronAPI.invoke('shell:interrupt');
      } catch (e) {
        console.warn('Failed to send interrupt signal', e);
      }
      return;
    }
    
    // 重写Enter默认行为
    if (data === '\r' || data === '\n' || data === '\r\n') {
      return;
    }
    console.log(terminalInstance.buffer.active.cursorX, terminalInstance.buffer.active.cursorY);
    terminalInstance?.write(data);
  });

  /**
   * onKey 处理发送 退格
   */
  terminalInstance.onKey(({ key, domEvent }) => {
    if (domEvent.key === 'Enter') {
      terminalInstance.write('\r\n')
      // 使用activeBuff变量获取用户输入的命令
      const cmd = getCurrentInput().trim();
      console.log('buff: ', cmd);
      if(cmd.length > 0){
        shellInvoke(cmd);
      }else{
        terminalInstance.write(PROMPT)
      }
      domEvent.preventDefault(); // 阻止默认的Enter行为
    } else if (domEvent.key === 'Backspace') {
      const cursorX = terminalInstance?.buffer.active.cursorX || 0;
      if (cursorX > 2) {
        terminalInstance?.write('\b \b');
      } 
      domEvent.preventDefault();
    }
  });

  /// 阻止光标移动
  terminalInstance.attachCustomKeyEventHandler((e)=> {
    if(e.key == 'ArrowUp'){
      return false
    }else if (e.key == 'ArrowDown'){
      return false
    }else if (e.key == 'ArrowLeft'){
      return false
    }else if (e.key == 'ArrowRight'){
      return false
    }

    return true
  })

  const api = (window as any).electronAPI
  if (api?.on) {
    removeListeners.add(
      api.on('shell:stdout', (data: any) => {
        terminalInstance.write(data);
    }))

    removeListeners.add(
      api.on('shell:stderr', (data: any) => {
        terminalInstance?.write(data); /* stream 写入 */
    }))

    removeListeners.add(
      api.on('shell:close', (data: any) => {
        console.log('shell:close:', data);
        // 确保命令缓冲区已重置
        terminalInstance?.write(`\r\n${PROMPT}`);
    }))
  }
})

onBeforeUnmount(() => {
  if (removeListeners) removeListeners.forEach(removeFunc => removeFunc())
  removeListeners.clear()
  terminalInstance?.dispose();
})
</script>

<template>
  <div class="card">
    <div id="terminal-container" style="height: 500px; width: 800px;">
      <div ref="terminalRef" id="terminal" style="height: 100%; width: 100%;"></div>
    </div>
  </div>
</template>

<style scoped>
@import '../../../../../node_modules/@xterm/xterm/css/xterm.css';

*{
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
