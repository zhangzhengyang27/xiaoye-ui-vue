<template>
  <a-tree
    v-model:expanded-keys="expandedKeys"
    v-model:selected-keys="selectedKeys"
    :load-data="onLoadData"
    :tree-data="treeData"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TreeProps } from 'xiaoye-ui';

const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const treeData = ref<TreeProps['treeData']>([
  { title: 'Expand to load', key: '0' },
  { title: 'Expand to load', key: '1' },
  { title: 'Tree Node', key: '2', isLeaf: true },
]);
const onLoadData: TreeProps['loadData'] = treeNode => {
  return new Promise<void>(resolve => {
    if (treeNode.dataRef.children) {
      resolve();
      return;
    }
    setTimeout(() => {
      treeNode.dataRef.children = [
        { title: 'Child Node', key: `${treeNode.eventKey}-0` },
        { title: 'Child Node', key: `${treeNode.eventKey}-1` },
      ];
      treeData.value = [...treeData.value];
      resolve();
    }, 1000);
  });
};
</script>
