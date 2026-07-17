<template>
  <div>
    <xy-radio-group v-model:value="size" style="margin-bottom: 16px">
      <xy-radio-button value="small">Small</xy-radio-button>
      <xy-radio-button value="default">Default</xy-radio-button>
      <xy-radio-button value="large">Large</xy-radio-button>
    </xy-radio-group>
    <xy-tabs v-model:active-key="activeKey" :size="size">
      <xy-tab-pane key="1" tab="Tab 1">Content of tab 1</xy-tab-pane>
      <xy-tab-pane key="2" tab="Tab 2">Content of tab 2</xy-tab-pane>
      <xy-tab-pane key="3" tab="Tab 3">Content of tab 3</xy-tab-pane>
    </xy-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { TabsProps } from 'xiaoye-ui';
const size = ref<TabsProps['size']>('small');
const activeKey = ref('1');
</script>
