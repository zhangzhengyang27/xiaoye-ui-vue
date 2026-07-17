<template>
  <xy-radio-group v-model:value="placement">
    <xy-radio-button value="topLeft">topLeft</xy-radio-button>
    <xy-radio-button value="topRight">topRight</xy-radio-button>
    <xy-radio-button value="bottomLeft">bottomLeft</xy-radio-button>
    <xy-radio-button value="bottomRight">bottomRight</xy-radio-button>
  </xy-radio-group>
  <br />
  <br />
  <xy-tree-select
    v-model:value="value"
    show-search
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto', minWidth: '300px' }"
    placeholder="Please select"
    allow-clear
    tree-default-expand-all
    :tree-data="treeData"
    :placement="placement"
    :dropdown-match-select-width="false"
    tree-node-filter-prop="label"
  >
    <template #title="{ value: val, label }">
      <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
      <template v-else>{{ label }}</template>
    </template>
  </xy-tree-select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { TreeSelectProps } from 'xiaoye-ui';
const placement = ref('topLeft' as const);
const value = ref<string>();
const treeData = ref<TreeSelectProps['treeData']>([
  {
    label: 'parent 1',
    value: 'parent 1',
    children: [
      {
        label: 'parent 1-0',
        value: 'parent 1-0',
        children: [
          {
            label: 'my leaf',
            value: 'leaf1',
          },
          {
            label: 'your leaf',
            value: 'leaf2',
          },
        ],
      },
      {
        label: 'parent 1-1',
        value: 'parent 1-1',
      },
    ],
  },
]);
</script>
