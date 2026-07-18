<template>
  <!-- 受控模式：通过 v-model:expandedKeys 绑定展开状态 -->
  <div>
    <xy-panel-menu v-model:expanded-keys="expandedKeys" :model="model" style="width: 280px" />
    <div style="margin-top: 16px; padding: 12px; background: #fafafa; border-radius: 4px">
      <p style="margin: 0 0 8px">当前展开的 keys：</p>
      <pre style="margin: 0">{{ JSON.stringify(expandedKeys, null, 2) }}</pre>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { PanelMenuItem } from 'xiaoye-ui';

const expandedKeys = ref<Record<string, boolean>>({
  '1': true,
});

const model = ref<PanelMenuItem[]>([
  {
    key: '1',
    label: '导航一',
    items: [
      { key: '1_0', label: '选项 1' },
      { key: '1_1', label: '选项 2' },
    ],
  },
  {
    key: '2',
    label: '导航二',
    items: [
      { key: '2_0', label: '选项 3' },
      { key: '2_1', label: '选项 4' },
    ],
  },
  {
    key: '3',
    label: '导航三',
    items: [
      { key: '3_0', label: '选项 5' },
      { key: '3_1', label: '选项 6' },
    ],
  },
]);
</script>
