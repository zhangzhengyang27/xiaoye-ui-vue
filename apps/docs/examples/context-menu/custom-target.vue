<template>
  <xy-context-menu ref="menuRef" :model="items" />
  <div class="context-menu-target-wrap">
    <div class="context-menu-target" @contextmenu="onContextMenu">只在此区域右键会弹出菜单</div>
    <div class="context-menu-other">此区域右键不会弹出菜单</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { MenuItem } from 'xiaoye-ui';

const menuRef = ref<any>(null);

const items: MenuItem[] = [
  {
    label: '刷新',
    command: () => console.warn('刷新'),
  },
  {
    label: '查看源代码',
    command: () => console.warn('查看源代码'),
  },
  {
    separator: true,
  },
  {
    label: '另存为',
    command: () => console.warn('另存为'),
  },
  {
    label: '打印',
    disabled: true,
    command: () => console.warn('打印'),
  },
];

const onContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  menuRef.value?.show(event);
};
</script>

<style scoped>
.context-menu-target-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.context-menu-target {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: #e6f4ff;
  color: #1677ff;
  border: 1px dashed #1677ff;
  border-radius: 4px;
}
.context-menu-other {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background: #f7f7f7;
  color: #999;
  border-radius: 4px;
}
</style>
