import { EditorSession } from '../editor/EditorSession';
import type { EditorSessionType } from '../models/editor/EditorTypes';

class TabManager {
  #tabHistory: string[] | null = [];
  #tabs: EditorSession[] | null = [];
  #activeId: string | null = null;

  /**
   * tab中创建Editor
   * @param type EditorSessionType
   */
  createNewEditor(type: EditorSessionType) {
    const newsession = new EditorSession(type);
    this.#tabs.push(newsession);
    this.activeById(newsession.id); //打开即激活
    this.switchToById(this.#activeId);
  }

  /**
   * 切换Tab，切换Editor
   */
  switchToById(id: string) {
    const preSession = this.getSessionById(this.#activeId);
    if (id != this.#activeId && preSession != null) {
      // 被创建过且不是当前
      this.activeById(id);
    }
  }

  /**
   * 关闭 tab
   * @param id str
   */
  closeTabById(id: string) {
    const index = this.#tabs.findIndex(el => el.id === id);

    if (this.#activeId === id) {
      this.#tabHistory.splice(-1);
      this.activeById(this.#tabHistory.at(-1));
      //TODO: 没有考虑全部关闭的情况
    }
    this.#tabs.splice(index, 1);
  }

  /**
   * 统一处理激活情况
   * @param id string
   */
  activeById(id: string) {
    this.#activeId = id;
    const i = this.#tabHistory.findIndex(el => el == id); // 如果存在则重新入队
    if (i != -1) this.#tabHistory.splice(i, 1);
    this.#tabHistory.push(id);
  }

  /**
   * 根据id查找Session
   * @param id
   * @returns
   */
  getSessionById(id: string | null): EditorSession | undefined {
    return this.#tabs.find(tab => tab.id === id);
  }

  get activeId() {
    return this.#activeId;
  }
}
