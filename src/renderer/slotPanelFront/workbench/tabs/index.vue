<template>
  <div class="flex h-full gap-0.5 overflow-hidden border-t border-b border-white/20 pt-2!">
    <div
      v-for="(tabID, index) in tabList"
      :key="tabID"
      @click="activeTab(tabID)"
      :id="tabID"
      class="relative flex h-full min-w-30 cursor-pointer items-center justify-center overflow-hidden rounded-t-xl pt-1.5! pl-4! transition-all duration-200 select-none"
      :class="
        currentActiveTab === tabID
          ? 'min-w-60 border-x border-white/20 bg-white/40 text-[#002FA7] shadow-sm'
          : 'text-text-muted min-w-40 border border-white/0 bg-white/0 opacity-50'
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
      @click="createTab('Terminal')"
      class="add-sign group text-text-brand/40 flex h-full w-16 cursor-pointer items-center justify-center rounded-t-xl bg-transparent pt-1! hover:bg-white/40"
    >
      <Plus :size="16" class="group-hover:text-text-brand" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Terminal, Plus, X } from 'lucide-vue-next';
import { useTabStore } from '../../store/useTabStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const tabStore = useTabStore();

const { currentActiveTab, tabList } = storeToRefs(tabStore);
const { createTab, activeTab, init } = tabStore;

// 初始化
onMounted(() => {
  init();
});
</script>
