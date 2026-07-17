<template>
  <div>
    <xy-tabs v-model:active-key="activeKey">
      <xy-tab-pane key="1" tab="Tab 1" style="height: 200px">Content of Tab Pane 1</xy-tab-pane>
      <xy-tab-pane key="2" tab="Tab 2" force-render>Content of Tab Pane 2</xy-tab-pane>
      <xy-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</xy-tab-pane>
      <template #renderTabBar="{ DefaultTabBar, ...props }">
        <component :is="DefaultTabBar" v-bind="props" :style="{ opacity: 0.5 }" />
      </template>
    </xy-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const activeKey = ref('1');
</script>
