<template>
  <xy-collapse v-model:active-key="activeKey" :expand-icon-position="expandIconPosition">
    <xy-collapse-panel key="1" header="This is panel header 1">
      <p>{{ text }}</p>
      <template #extra><setting-outlined @click="handleClick" /></template>
    </xy-collapse-panel>
    <xy-collapse-panel key="2" header="This is panel header 2">
      <p>{{ text }}</p>
      <template #extra><setting-outlined @click="handleClick" /></template>
    </xy-collapse-panel>
    <xy-collapse-panel key="3" header="This is panel header 3" collapsible="disabled">
      <p>{{ text }}</p>
      <template #extra><setting-outlined @click="handleClick" /></template>
    </xy-collapse-panel>
  </xy-collapse>
  <br />
  <span>Expand Icon Position:</span>
  <xy-select v-model:value="expandIconPosition">
    <xy-select-option value="start">start</xy-select-option>
    <xy-select-option value="end">end</xy-select-option>
  </xy-select>
</template>
<script lang="ts" setup>
import { SettingOutlined } from '@xiaoye-ui/icons';
import { ref, watch } from 'vue';
import type { CollapseProps } from 'xiaoye-ui';

const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
const activeKey = ref(['1']);
const expandIconPosition = ref<CollapseProps['expandIconPosition']>('start');

const handleClick = (event: MouseEvent) => {
  // If you don't want click extra trigger collapse, you can prevent this:
  event.stopPropagation();
};
watch(activeKey, val => {
  console.log(val);
});
</script>
