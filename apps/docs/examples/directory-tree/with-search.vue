<template>
  <div>
    <!-- 搜索框：输入关键字过滤目录树，自动展开匹配项的父节点 -->
    <xy-input-search
      v-model:value="searchValue"
      style="margin-bottom: 8px"
      placeholder="搜索文件名"
    />
    <xy-directory-tree
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="treeData"
      @expand="onExpand"
    >
      <template #title="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substring(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </xy-directory-tree>
  </div>
</template>
<script lang="ts" setup>
import type { TreeProps } from 'xiaoye-ui';
import { ref, watch } from 'vue';

const treeData: TreeProps['treeData'] = [
  {
    title: 'src',
    key: '0-0',
    children: [
      { title: 'index.ts', key: '0-0-0', isLeaf: true },
      { title: 'App.vue', key: '0-0-1', isLeaf: true },
      {
        title: 'components',
        key: '0-0-2',
        children: [
          { title: 'Button.tsx', key: '0-0-2-0', isLeaf: true },
          { title: 'Input.tsx', key: '0-0-2-1', isLeaf: true },
        ],
      },
    ],
  },
  {
    title: 'public',
    key: '0-1',
    children: [
      { title: 'favicon.ico', key: '0-1-0', isLeaf: true },
      { title: 'logo.svg', key: '0-1-1', isLeaf: true },
    ],
  },
];

// 扁平化数据用于搜索时定位父节点
const dataList: { key: string | number; title: string }[] = [];
const generateList = (data: TreeProps['treeData']) => {
  data.forEach(node => {
    dataList.push({ key: node.key, title: node.title });
    if (node.children) generateList(node.children);
  });
};
generateList(treeData);

const getParentKey = (
  key: string | number,
  tree: TreeProps['treeData'],
): string | number | undefined => {
  let parentKey: string | number | undefined;
  tree.forEach(node => {
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  });
  return parentKey;
};

const expandedKeys = ref<(string | number)[]>([]);
const searchValue = ref<string>('');
const autoExpandParent = ref<boolean>(true);

const onExpand = (keys: (string | number)[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

watch(searchValue, value => {
  const expanded = dataList
    .map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, treeData);
      }
      return null;
    })
    .filter((item, index, self) => item && self.indexOf(item) === index);
  expandedKeys.value = expanded;
  autoExpandParent.value = true;
});
</script>
