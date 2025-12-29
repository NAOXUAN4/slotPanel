<template>
  <div class="flex h-full gap-0.5 overflow-hidden border-t border-b border-white/20 pt-2!">
    <div
      v-for="(tabID, index) in tabList"
      @click="activeTab(tabID)"
      :id="tabID"
      class="relative flex h-full min-w-30 cursor-pointer items-center justify-center overflow-hidden rounded-t-xl pt-1.5! pl-4! transition-all duration-500 select-none"
      :class="
        currentActiveTab === tabID
          ? 'min-w-40 border border-white/20 bg-white/40 text-[#002FA7] shadow-sm'
          : 'min-w-30 border border-white/0 bg-white/0 opacity-50'
      "
    >
      <Terminal :size="20" class="transition-colors" />
      <span class="truncate pl-3!" :class="currentActiveTab === tabID ? 'pr-10!' : 'pr-4!'"
        >terminal_{{ index }}
      </span>
      <X
        v-if="currentActiveTab === tabID"
        :size="16"
        class="absolute right-2 opacity-50 transition-colors hover:text-red-500 hover:opacity-100"
      />
    </div>

    <div
      @click="createTab"
      class="add-sign flex h-full w-10 cursor-pointer items-center justify-center bg-transparent pt-1!"
    >
      <Plus :size="16" class="opacity-50 transition-colors" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useSessionStore } from '../../store/sessionStore';
import { Terminal, Plus, X } from 'lucide-vue-next';

const { createSession, switchSession, editorSessions, getActiveSessionId } = useSessionStore();

onMounted(() => {
  console.log('tabs mounted');
});

const tabList = computed(() => editorSessions.map(session => session.id));
const currentActiveTab = ref<string>('');

const syncActiveId = () => {
  currentActiveTab.value = getActiveSessionId();
};

/**
 * 创建 tab 调用创建tab api
 */
const createTab = async () => {
  createSession('Terminal');
  syncActiveId();
};

const activeTab = (tab_id: string) => {
  // console.log(tabList.value);
  switchSession(tab_id);
  syncActiveId();
};
</script>

<style scoped></style>
