// store/tabStore.ts
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useSessionStore } from './sessionStore';
import convExtension from '../extensions/conv/index.vue';
import type { EditorSessionType } from '../core/models/editor/EditorTypes';

export const useTabStore = defineStore('tab', () => {
  const sessionStore = useSessionStore();
  const currentActiveTab = ref<string>('');

  const tabList = computed(() => sessionStore.editorSessions.map(session => session.id));

  // 同步激活ID
  const syncActiveId = () => {
    currentActiveTab.value = sessionStore.getActiveSessionId();
  };

  // 创建标签页
  const createTab = async (type: EditorSessionType) => {
    switch (type) {
      case 'Terminal':
        sessionStore.createSession('Terminal');
        break;
      case 'WebView':
        break;
      case 'Extension':
        sessionStore.createSession('Extension', {
          component: convExtension,
          props: { id: '212' },
        });
        break;
      default:
        break;
    }

    setTimeout(() => {
      syncActiveId();
    }, 0);
  };

  const activeTab = (tab_id: string) => {
    sessionStore.switchSession(tab_id);
    syncActiveId();
  };

  // watch(
  //   () => sessionStore.editorSessions,
  //   () => {
  //     syncActiveId();
  //   },
  //   { deep: true }
  // );

  // watch(
  //   () => sessionStore.getActiveSessionId(),
  //   newId => {
  //     currentActiveTab.value = newId;
  //   }
  // );

  // 初始化
  const init = () => {
    syncActiveId();
  };

  return {
    // 状态
    currentActiveTab,

    // 计算属性
    tabList,

    // 方法
    createTab,
    activeTab,
    syncActiveId,
    init,
  };
});
