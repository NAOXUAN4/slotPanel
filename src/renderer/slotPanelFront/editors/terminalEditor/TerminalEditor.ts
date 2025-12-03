import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { EditorPanel } from '../../core/editor/EditorPanel';

const PROMPT = '$ ';

export class TerminalEditor extends EditorPanel {
  #termInstance: Terminal | null = null;
  #container: HTMLElement | null = null;

  #inputBuffer: string | null = null;
  #removeListeners: Set<() => void> = new Set();
  #fitAddon: FitAddon | null = null;

  constructor(id: string) {
    super(id, 'terminal');
  }
  create(container: HTMLElement): void {
    if (!container) return;

    this.#termInstance = new Terminal({
      rows: 24,
      cols: 80,
      cursorBlink: true,
      fontFamily: 'Consolas, Monaco, "Courier New", "Microsoft YaHei", monospace',
      allowTransparency: true,
      scrollback: 1000,

      111
      convertEol: true,
      theme: {
        background: 'rgba(36, 36, 36, 1)',
        foreground: '#ffffff',
      },
    });

    this.#container = container;
    this.#inputBuffer = '';

    this.#fitAddon = new FitAddon();
    this.#termInstance.loadAddon(this.#fitAddon);

    this.#termInstance.open(this.#container);
    this.#fitAddon.fit();

    this.#termInstance?.write(`\n${PROMPT}`);

    this.isMounted = true;
    this.#container.style.display = 'none';
  }

  /** -------------------------
   * shell 通信
  ----------------------------*/
  async shellInvoke(command: string) {
    try {
      const result = await (window as any).electronAPI.invoke('shell:exec', command);
      // console.log('shell:exec call', result);
    } catch (e) {
      console.warn('shell:exec err', e);
    }
  }

  shellOnListener() {
    const api = (window as any).electronAPI;
    if (api?.on) {
      this.#removeListeners.add(
        api.on('shell:stdout', (data: any) => {
          this.#termInstance.write(data);
        })
      );

      this.#removeListeners.add(
        api.on('shell:stderr', (data: any) => {
          this.#termInstance?.write(data); /* stream 写入 */
        })
      );

      this.#removeListeners.add(
        api.on('shell:close', (data: any) => {
          console.log('shell:close:', data);
          this.cleanInputerBuffer();
          this.#termInstance?.write(`\r\n${PROMPT}`);
        })
      );
    }
  }

  /** ------------------------
   * 终端事件绑定
  ---------------------------*/
  private bindTerminalEvents() {
    const disposable_ondata = this.#termInstance.onData(data => {
      // 处理Ctrl+C (\x03)，用于中断当前命令
      if (data === '\x03') {
        this.cleanInputerBuffer();
        this.#termInstance?.write(`\r\n${PROMPT}`);
        try {
          (window as any).electronAPI.invoke('shell:interrupt');
        } catch (e) {
          console.warn('Failed to send interrupt signal', e);
        }
        return;
      }
      // 过滤退格键和删除键
      if (data === '\b' || data === '\x7f') {
        return;
      }
      // 过滤Enter默认行为
      if (data === '\r' || data === '\n' || data === '\r\n') {
        return;
      }
      console.log(
        this.#termInstance.buffer.active.cursorX,
        this.#termInstance.buffer.active.cursorY
      );
      this.#inputBuffer += data; // 输入Buffer
      this.#termInstance?.write(data);
    });

    this.#removeListeners.add(() => disposable_ondata.dispose());

    /**
     * onKey 处理发送 退格
     */
    const disposable_onkey = this.#termInstance.onKey(({ key, domEvent }) => {
      if (domEvent.key === 'Enter') {
        this.#termInstance.write('\r\n');
        // 使用activeBuff变量获取用户输入的命令
        const cmd = this.#inputBuffer.trim();
        this.cleanInputerBuffer();

        console.log('buff: ', cmd);
        if (cmd.length > 0) {
          this.shellInvoke(cmd);
        } else {
          this.#termInstance.write(PROMPT);
        }
        domEvent.preventDefault(); // 阻止默认的Enter行为
      } else if (domEvent.key === 'Backspace') {
        const cursorX = this.#termInstance?.buffer.active.cursorX || 0;
        if (cursorX > 2) {
          this.#inputBuffer = this.#inputBuffer.slice(0, -1);
          // console.log('inputerBuffer: ', this.#inputBuffer);

          this.#termInstance?.write('\b \b');
        }
        domEvent.preventDefault();
      }
    });
    this.#removeListeners.add(() => disposable_onkey.dispose());

    /// 阻止光标移动
    this.#termInstance.attachCustomKeyEventHandler(e => {
      if (e.key == 'ArrowUp') {
        return false;
      } else if (e.key == 'ArrowDown') {
        return false;
      } else if (e.key == 'ArrowLeft') {
        return false;
      } else if (e.key == 'ArrowRight') {
        return false;
      }
      return true;
    });
  }

  /**
   *
   * 工具函数
   */
  cleanInputerBuffer(): void {
    this.#inputBuffer = '';
  }

  fit(): void {
    this.#fitAddon.fit();
  }

  mount(): void {
    if (!this.#container || !this.#termInstance) {
      return;
    }
    this.shellOnListener();
    this.bindTerminalEvents();

    this.#container.style.display = 'block';
  }

  unmount(): void {
    if (this.#container) {
      this.#container.style.display = 'none';
    }
    this.cleanInputerBuffer();
    if (this.#removeListeners) this.#removeListeners.forEach(removeFunc => removeFunc());
    this.#removeListeners.clear();
  }

  dispose(): void {
    this.#termInstance.dispose();
    this.#termInstance = null;
  }
}
