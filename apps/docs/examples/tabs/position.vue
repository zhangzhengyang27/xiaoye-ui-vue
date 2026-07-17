<template>
  <xy-radio-group v-model:value="tabPosition" style="margin: 8px">
    <xy-radio-button value="top">top</xy-radio-button>
    <xy-radio-button value="bottom">bottom</xy-radio-button>
    <xy-radio-button value="left">left</xy-radio-button>
    <xy-radio-button value="right">right</xy-radio-button>
  </xy-radio-group>
  <xy-tabs v-model:active-key="activeKey" :tab-position="tabPosition" animated>
    <xy-tab-pane key="1" tab="Tab 1">Content of Tab 1</xy-tab-pane>
    <xy-tab-pane key="2" tab="Tab 2">Content of Tab 2</xy-tab-pane>
    <xy-tab-pane key="3" tab="Tab 3">Content of Tab 3</xy-tab-pane>
  </xy-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { TabsProps } from 'xiaoye-ui/tabs';
const tabPosition = ref<TabsProps['tabPosition']>('top');
const activeKey = ref('1');
</script>
