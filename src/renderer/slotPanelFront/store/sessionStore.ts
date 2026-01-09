import { defineStore } from 'pinia';
import { ref, computed, markRaw } from 'vue';
import { TabManager } from '../core/tab/TabManager';
import { EditorSession } from '../core/editor/EditorSession';
import { EditorSessionType } from '../core/models/editor/EditorTypes';

// 创建TabManager实例
export const tabManagerInstance = new TabManager();

export const useSessionStore = defineStore('sessionStore', () => {
  // 状态
  const activeSessionId = ref<string | null>(null);
  const editorSessions = ref<EditorSession[]>([]);

  // 计算属性
  const activeSession = computed(() => {
    return tabManagerInstance.activeId;
  });

  // 操作
  const createSession = (type: EditorSessionType, args?: any) => {
    const session = markRaw(tabManagerInstance.createNewEditor(type, args));
    editorSessions.value.push(session);
    activeSessionId.value = session.id;
    return session;
  };

  const switchSession = (sessionId: string) => {
    tabManagerInstance.switchToById(sessionId);
    activeSessionId.value = sessionId;
    // console.log(sessionId);
  };

  const getActiveSessionId = () => {
    return activeSessionId.value;
  };

  return {
    // 状态
    activeSessionId,
    editorSessions,

    // 计算属性
    activeSession,

    // 操作
    createSession,
    switchSession,
    getActiveSessionId,
  };
});
