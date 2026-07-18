<template>
  <!-- 基础用法：通过 model 传入菜单项，点击头部展开 / 折叠 -->
  <xy-panel-menu
    :model="model"
    style="width: 280px"
    @expand="onExpand"
    @collapse="onCollapse"
    @item-click="onItemClick"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { PanelMenuItem } from 'xiaoye-ui';

const model = ref<PanelMenuItem[]>([
  {
    key: '1',
    label: '文件',
    items: [
      { key: '1_0', label: '新建' },
      { key: '1_1', label: '打开' },
      { key: '1_2', label: '保存' },
    ],
  },
  {
    key: '2',
    label: '编辑',
    items: [
      { key: '2_0', label: '撤销' },
      { key: '2_1', label: '重做' },
      { key: '2_2', label: '剪切' },
    ],
  },
  {
    key: '3',
    label: '视图',
    items: [
      { key: '3_0', label: '放大' },
      { key: '3_1', label: '缩小' },
    ],
  },
]);

// 面板展开 / 折叠 / 子项点击回调
function onExpand(e: any) {
  // eslint-disable-next-line no-console
  console.log('expand', e.item?.label);
}
function onCollapse(e: any) {
  // eslint-disable-next-line no-console
  console.log('collapse', e.item?.label);
}
function onItemClick(e: any) {
  // eslint-disable-next-line no-console
  console.log('itemClick', e.item?.label);
}
</script>
