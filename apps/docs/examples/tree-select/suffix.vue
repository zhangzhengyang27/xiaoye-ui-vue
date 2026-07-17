<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-tree-select
      v-model:value="value"
      show-search
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allow-clear
      tree-default-expand-all
      :tree-data="treeData"
      :field-names="{
        children: 'children',
        value: 'value',
        label: 'title',
      }"
      tree-node-filter-prop="title"
    >
      <template #suffixIcon><SmileOutlined /></template>
    </xy-tree-select>

    <xy-tree-select
      v-model:value="value1"
      show-search
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allow-clear
      multiple
      show-arrow
      tree-default-expand-all
      :tree-data="treeData"
      :field-names="{
        children: 'children',
        value: 'value',
        label: 'title',
      }"
      tree-node-filter-prop="title"
    >
      <template #suffixIcon><SmileOutlined /></template>
    </xy-tree-select>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { SmileOutlined } from '@xiaoye-ui/icons';
import type { TreeSelectProps } from 'xiaoye-ui';
const value = ref<string>();
const value1 = ref<string[]>([]);
const treeData = ref<TreeSelectProps['treeData']>([
  {
    title: 'parent 1',
    value: 'parent 1',
    children: [
      {
        title: 'parent 1-0',
        value: 'parent 1-0',
        children: [
          {
            title: 'my leaf',
            value: 'leaf1',
          },
          {
            title: 'your leaf',
            value: 'leaf2',
          },
        ],
      },
      {
        title: 'parent 1-1',
        value: 'parent 1-1',
      },
    ],
  },
]);
watch(value, () => {
  console.log('select', value.value);
});
</script>
