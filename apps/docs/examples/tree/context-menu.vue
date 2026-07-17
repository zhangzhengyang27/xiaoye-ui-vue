<template>
  <xy-tree v-model:expanded-keys="expandedKeys" :tree-data="treeData">
    <template #title="{ key: treeKey, title }">
      <xy-dropdown :trigger="['contextmenu']">
        <span>{{ title }}</span>
        <template #overlay>
          <xy-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
            <xy-menu-item key="1">1st menu item</xy-menu-item>
            <xy-menu-item key="2">2nd menu item</xy-menu-item>
            <xy-menu-item key="3">3rd menu item</xy-menu-item>
          </xy-menu>
        </template>
      </xy-dropdown>
    </template>
  </xy-tree>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue';

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
    ],
  },
];
const onContextMenuClick = (treeKey: string, menuKey: string | number) => {
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
};
const expandedKeys = ref<string[]>(['0-0-0', '0-0-1']);

watch(expandedKeys, () => {
  console.log('expandedKeys', expandedKeys);
});
</script>
