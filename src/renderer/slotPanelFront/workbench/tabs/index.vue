<template>
  <div class="h-full pl-2 bg-[rgba(18,44,93,0.90)] flex gap-0.5 overflow-auto">
    <div v-for="(tabID, index) in tabList" @click="activeTab(tabID)"  :id="tabID" class="h-full pl-2 bg-white/20 backdrop-blur-sm w-40 min-w-40 flex justify-center items-center cursor-pointer">
      {{index}}
      <div class="del-sign-container  w-20 flex justify-end pr-1">✖️</div>
    </div>

    <div @click="createTab" class="add-sign h-full w-10  flex bg-white/20 backdrop-blur-sm justify-center items-center cursor-pointer">
      +
    </div>

  </div>
</template>

<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { useSessionStore } from '../../store/sessionStore'

  const { createSession, switchSession, editorSessions } = useSessionStore()

  onMounted(() => {
    console.log('tabs mounted')
  })

  // 使用计算属性从store获取tabList
  const tabList = computed(() => editorSessions.map(session => session.id))

  /**
   * 创建 tab 调用创建tab api
   */
  const createTab = async() => {
    createSession('Terminal');
  }

  const activeTab = (tab_id: string) => {
    // console.log(tabList.value);
    switchSession(tab_id);
  }

</script>

<style scoped>
</style>