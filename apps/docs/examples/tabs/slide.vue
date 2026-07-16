<template>
  <div>
    <a-radio-group v-model:value="mode" :style="{ marginBottom: '8px' }">
      <a-radio-button value="top">Horizontal</a-radio-button>
      <a-radio-button value="left">Vertical</a-radio-button>
    </a-radio-group>
    <a-tabs
      v-model:activeKey="activeKey"
      :tab-position="mode"
      :style="{ height: '200px' }"
      @tabScroll="callback"
    >
      <a-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`">Content of tab {{ i }}</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { TabsProps } from 'xiaoye-ui';
const mode = ref<TabsProps['tabPosition']>('top');
const activeKey = ref(1);
const callback: TabsProps['onTabScroll'] = val => {
  console.log(val);
};
</script>
