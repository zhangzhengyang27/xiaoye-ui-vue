<!-- 多格式输出：切换 hex / rgb / hsb 三种格式，使用 typography-text 展示当前值 -->
<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-row">
      <span class="demo-label">输出格式：</span>
      <xy-radio-group v-model:value="format">
        <xy-radio-button value="hex">HEX</xy-radio-button>
        <xy-radio-button value="rgb">RGB</xy-radio-button>
        <xy-radio-button value="hsb">HSB</xy-radio-button>
      </xy-radio-group>
    </div>

    <div class="demo-row">
      <span class="demo-label">颜色选择：</span>
      <xy-color-picker v-model="value" :format="format" :default-color="defaultColor" />
    </div>

    <div class="demo-row">
      <span class="demo-label">当前值：</span>
      <xy-typography-text code copyable>{{ formattedValue }}</xy-typography-text>
    </div>

    <p class="demo-tip">
      切换格式后，绑定值会按对应格式输出：HEX 为字符串、RGB 为 { r, g, b }、HSB 为 { h, s, b
      }。点击值右侧按钮可一键复制。
    </p>
  </xy-space>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { ColorPickerFormat } from 'xiaoye-ui/color-picker';

const format = ref<ColorPickerFormat>('hex');
const value = ref<any>('1890ff');
const defaultColor = ref('1890ff');

const formattedValue = computed(() => {
  if (value.value == null) return 'null';
  if (typeof value.value === 'string') return `"${value.value}"`;
  return JSON.stringify(value.value);
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
  width: 72px;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
