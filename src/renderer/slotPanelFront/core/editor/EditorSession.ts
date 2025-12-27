import { TerminalEditor } from '../../editors/terminalEditor/TerminalEditor';
import { EditorPanel } from '../models/editor/EditorPanelAbstract';
import type { EditorSessionType } from '../models/editor/EditorTypes';

// 用于包裹所有的editor实例的通用container
export class EditorSession {
  #id: string;
  #type: EditorSessionType;
  #container: HTMLElement | null = null;
  #editorInstance: EditorPanel | null = null;

  constructor(type: EditorSessionType) {
    this.#type = type;
    this.#id = crypto.randomUUID();

    if (type == 'Terminal') {
      this.#editorInstance = new TerminalEditor(this.#id);
    } else if (type == 'WebView') {
      //TODO: WebViewInstance
      console.log('WebViewInstance');
    }
  }

  get id() {
    return this.#id;
  }

  get container() {
    return this.#container;
  }

  mount(container: HTMLElement) {
    if (container) {
      if (this.#container !== container || !this.#editorInstance) {
        this.#container = container;
        this.#editorInstance.create(container);
      }
      this.#editorInstance.mount();
    }
  }

  unmount() {
    this.#editorInstance.unmount();
  }

  dispose() {
    this.#editorInstance.dispose();
  }
}
