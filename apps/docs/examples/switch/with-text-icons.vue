<!-- 文字与图标：通过 checkedChildren/unCheckedChildren 属性与插槽自定义开关内容，对比不同尺寸 -->
<template>
  <xy-space direction="vertical" :size="16">
    <!-- 文字内容 - 默认尺寸 -->
    <div class="demo-row">
      <span class="demo-label">文字 · 默认：</span>
      <xy-switch
        v-model:checked="state.textDefault"
        checked-children="启用"
        un-checked-children="停用"
      />
    </div>

    <!-- 文字内容 - 小尺寸 -->
    <div class="demo-row">
      <span class="demo-label">文字 · small：</span>
      <xy-switch
        v-model:checked="state.textSmall"
        size="small"
        checked-children="开"
        un-checked-children="关"
      />
    </div>

    <!-- 图标内容 - 使用 slot（默认尺寸） -->
    <div class="demo-row">
      <span class="demo-label">图标 · 默认：</span>
      <xy-switch v-model:checked="state.iconDefault">
        <template #checkedChildren><check-outlined /></template>
        <template #unCheckedChildren><close-outlined /></template>
      </xy-switch>
    </div>

    <!-- 图标内容 - 使用 slot（小尺寸） -->
    <div class="demo-row">
      <span class="demo-label">图标 · small：</span>
      <xy-switch v-model:checked="state.iconSmall" size="small">
        <template #checkedChildren><check-outlined /></template>
        <template #unCheckedChildren><close-outlined /></template>
      </xy-switch>
    </div>

    <p class="demo-tip">
      通过
      <code>checked-children</code>
      /
      <code>un-checked-children</code>
      属性或同名插槽自定义开关内容；图标场景需使用插槽形式传入。
    </p>
  </xy-space>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { CheckOutlined, CloseOutlined } from '@xiaoye-ui/icons';

const state = reactive({
  textDefault: true,
  textSmall: true,
  iconDefault: true,
  iconSmall: true,
});
</script>

<style scoped>
.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-label {
  font-size: 14px;
  color: #555;
  width: 96px;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
.demo-tip code {
  padding: 1px 6px;
  border-radius: 3px;
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
