import { ipcMain, BrowserWindow } from 'electron';
import { shellExec, getCurrentChildProcess } from './service/shell-service';

export function registerIPCHandlers(mainWindow: BrowserWindow) {
  /// --------------------------------------- invoke -----------------------------------

  // 'some-channel is a test channel'
  ipcMain.handle('some-channel', async (_event, args) => {
    console.log('ipcMain.handle some-channel called with', args);
    /// return to renderer
    return { ok: true, echo: args };
  });

  // 'run command'
  ipcMain.handle('shell:exec', async (_event, command: string) => {
    const shellchild = shellExec(mainWindow, command);

    return { ok: true, from: 'shell:exec' };
  });

  // 处理中断命令的请求 (Ctrl+C)
  ipcMain.handle('shell:interrupt', async () => {
    try {
      const child = getCurrentChildProcess();
      if (child && !child.killed) {
        console.log('Interrupting current command');
        // 在Windows上，我们需要使用Ctrl+C信号
        if (process.platform === 'win32') {
          // 在Windows上，我们可以尝试kill命令
          child.kill();
        } else {
          // 在Unix系统上，我们可以发送SIGINT信号
          process.kill(child.pid, 'SIGINT');
        }
        return { ok: true, message: 'Command interrupted' };
      }
      return { ok: false, message: 'No active command to interrupt' };
    } catch (error) {
      console.error('Failed to interrupt command:', error);
      return { ok: false, error: String(error) };
    }
  });

  /**
   *
   */
  ipcMain.handle('sys:closeWindow', async (_event, command: string) => {
    // TODO : 关闭
    return { ok: true, from: 'shell:exec' };
  });

  ipcMain.handle('sys:maximizeWindow', async (_event, command: string) => {
    // TODO : 最小化

    return { ok: true, from: 'sys:maximizeWindow' };
  });

  ipcMain.handle('sys:minimizeWindow', async (_event, command: string) => {
    // TODO : 最大化

    return { ok: true, from: 'sys:minimizeWindow' };
  });

  /// --------------------------------------- on ---------------------------------------

  // 当渲染器加载完毕，发送一次测试消息（渲染器会订阅 `push-from-main`）
  mainWindow.webContents.on('did-finish-load', () => {
    try {
      mainWindow.webContents.send('push-from-main', { text: 'hello from main (did-finish-load)' });
    } catch (e) {
      console.warn('failed to send `push-from-main`', e);
    }
  });
}
