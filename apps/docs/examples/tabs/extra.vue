<template>
  <xy-tabs v-model:active-key="activeKey">
    <xy-tab-pane key="1" tab="Tab 1">Content of tab 1</xy-tab-pane>
    <xy-tab-pane key="2" tab="Tab 2">Content of tab 2</xy-tab-pane>
    <xy-tab-pane key="3" tab="Tab 3">Content of tab 3</xy-tab-pane>
    <template #leftExtra>
      <xy-button class="tabs-extra-demo-button">Left Extra Action</xy-button>
    </template>
    <template #rightExtra>
      <xy-button>Right Extra Action</xy-button>
    </template>
  </xy-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const activeKey = ref('1');
</script>

<style scoped>
.tabs-extra-demo-button {
  margin-right: 16px;
}

.xy-row-rtl .tabs-extra-demo-button {
  margin-right: 0;
  margin-left: 16px;
}
</style>
