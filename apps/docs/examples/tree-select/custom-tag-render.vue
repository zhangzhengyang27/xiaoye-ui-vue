<template>
  <xy-tree-select
    v-model:value="value"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="Please select"
    allow-clear
    multiple
    :show-checked-strategy="SHOW_ALL"
    tree-default-expand-all
    :tree-data="treeData"
    tree-node-filter-prop="label"
  >
    <template #tagRender="{ label, closable, onClose, option }">
      <xy-tag :closable="closable" :color="option.color" style="margin-right: 3px" @close="onClose">
        {{ label }}&nbsp;&nbsp;
      </xy-tag>
    </template>
    <template #title="{ value: val, label }">
      <b v-if="val === 'parent 1-1'" style="color: #08c">{{ val }}</b>
      <template v-else>{{ label }}</template>
    </template>
  </xy-tree-select>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { TreeSelectProps } from 'xiaoye-ui';
import { TreeSelect } from 'xiaoye-ui';
const SHOW_ALL = TreeSelect.SHOW_ALL;
const value = ref<string[]>(['parent 1', 'parent 1-0', 'leaf1']);
const treeData = ref<TreeSelectProps['treeData']>([
  {
    label: 'parent 1',
    value: 'parent 1',
    color: 'pink',
    children: [
      {
        label: 'parent 1-0',
        value: 'parent 1-0',
        color: 'pink',
        children: [
          {
            label: 'parent 1-0-0',
            value: 'parent 1-0-0',
            color: 'orange',
            children: [
              {
                label: 'my leaf',
                value: 'leaf1',
                color: 'green',
              },
              {
                label: 'your leaf',
                value: 'leaf2',
                color: 'cyan',
              },
            ],
          },
          {
            label: 'parent 1-0-1',
            value: 'parent 1-0-1',
            color: 'blue',
          },
        ],
      },
      {
        label: 'parent 1-1',
        value: 'parent 1-1',
        color: 'blue',
      },
    ],
  },
]);
watch(value, () => {
  console.log('select', value.value);
});
</script>
