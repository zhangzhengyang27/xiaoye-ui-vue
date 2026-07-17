<template>
  <xy-tree-select
    v-model:value="checkedKeys"
    style="width: 100%"
    tree-checkable
    tree-default-expand-all
    :show-checked-strategy="SHOW_PARENT"
    :height="233"
    :tree-data="treeData"
    :max-tag-count="10"
    tree-node-filter-prop="title"
  >
    <template #title="{ title, value }">
      <span v-if="value === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </xy-tree-select>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { TreeSelectProps } from 'xiaoye-ui';
import { TreeSelect } from 'xiaoye-ui';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

function dig(path = '0', level = 3) {
  const list: TreeSelectProps['treeData'] = [];
  for (let i = 0; i < 10; i += 1) {
    const value = `${path}-${i}`;
    const treeNode: TreeSelectProps['treeData'][number] = {
      title: value,
      value,
    };

    if (level > 0) {
      treeNode.children = dig(value, level - 1);
    }

    list.push(treeNode);
  }
  return list;
}

const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
watch(checkedKeys, () => {
  console.log('checkedKeys', checkedKeys);
});
const treeData = ref<TreeSelectProps['treeData']>(dig());
</script>
