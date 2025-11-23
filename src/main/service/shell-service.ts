import { spawn } from 'child_process';
import { BrowserWindow } from 'electron';
export function shellExec(win: BrowserWindow, command: string) {
  /**
   * spawn 是 Node.js 中 child_process 模块提供的一个 API，用于创建子进程执行命令。让我为您详细介绍它的用途和参数：

      spawn API 的作用
      spawn 用于在 Node.js 应用程序中启动一个新的子进程来执行外部命令。它特别适合执行长时间运行的进程，因为它通过流（stream）的方式处理数据，而不是将所有数据缓存起来。这使得它可以高效地处理大量输出的数据。
   */
  const child = spawn(command, {
    shell: true,
  });

  // 处理输出，序列化为 JSON
  child.stdout.on('data', data => {
    win.webContents.send('shell:stdout', data.toString());
  });

  child.stderr.on('data', data => {
    win.webContents.send('shell:stderr', data.toString());
  });

  child.on('close', code => {
    /* 处理关闭*/
    win.webContents.send('shell:close', code);
  });

  return child;
}
