<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      message="通过 toggleButtonProps 可向切换按钮透传任意属性，例如 aria-label、自定义类名等，便于无障碍标注或样式定制。"
    />

    <xy-fieldset
      legend="自定义 aria-label"
      toggleable
      :toggle-button-props="{ 'aria-label': '展开或收起用户权限设置' }"
    >
      <xy-checkbox-group v-model:value="perms">
        <xy-checkbox value="read">读取</xy-checkbox>
        <xy-checkbox value="write">写入</xy-checkbox>
        <xy-checkbox value="delete">删除</xy-checkbox>
        <xy-checkbox value="admin">管理员</xy-checkbox>
      </xy-checkbox-group>
    </xy-fieldset>

    <xy-fieldset
      legend="自定义按钮类名"
      toggleable
      :toggle-button-props="{ class: 'custom-toggle-btn' }"
    >
      <p>
        切换按钮被附加了
        <code>custom-toggle-btn</code>
        类名，可用于自定义样式。
      </p>
      <p>右侧切换图标默认为 + / -，可通过 toggleicon 插槽自定义。</p>
    </xy-fieldset>

    <xy-fieldset
      v-model:collapsed="collapsed"
      legend="受控 + 按钮 props"
      toggleable
      :toggle-button-props="{ 'aria-label': '受控切换' }"
    >
      <p>受控模式与 toggleButtonProps 可同时使用。</p>
      <xy-button size="small" @click="collapsed = !collapsed">
        内部按钮也能切换：{{ collapsed ? '展开' : '折叠' }}
      </xy-button>
    </xy-fieldset>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const perms = ref<string[]>(['read']);
const collapsed = ref(false);
</script>
<style scoped>
:deep(.custom-toggle-btn) {
  font-weight: 600;
}
:deep(.custom-toggle-btn:hover) {
  color: #1677ff;
}
</style>
