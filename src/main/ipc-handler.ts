import { ipcMain, BrowserWindow } from 'electron';
import { shellExec } from './service/shell-service';

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
