<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-color-picker-row">
      <span class="demo-label">格式：</span>
      <xy-radio-group v-model:value="format">
        <xy-radio-button value="hex">HEX</xy-radio-button>
        <xy-radio-button value="rgb">RGB</xy-radio-button>
        <xy-radio-button value="hsb">HSB</xy-radio-button>
      </xy-radio-group>
    </div>
    <div class="demo-color-picker-row">
      <span class="demo-label">当前值：</span>
      <xy-color-picker v-model="value" :format="format" :default-color="defaultColor" />
      <code class="demo-value">{{ formattedValue }}</code>
    </div>
    <p class="demo-tip">
      切换格式后，绑定值会按对应格式输出：HEX 为字符串、RGB 为 { r, g, b }、HSB 为 { h, s, b }。
    </p>
  </xy-space>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { ColorPickerFormat } from 'xiaoye-ui/color-picker';

const format = ref<ColorPickerFormat>('hex');
const value = ref<any>('ff5252');
const defaultColor = ref('ff5252');

const formattedValue = computed(() => {
  if (value.value == null) return 'null';
  if (typeof value.value === 'string') return `"${value.value}"`;
  return JSON.stringify(value.value);
});
</script>

<style scoped>
.demo-color-picker-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-label {
  font-size: 14px;
  color: #555;
}
.demo-value {
  font-size: 13px;
  color: #1890ff;
  font-family: 'SFMono-Regular', Consolas, monospace;
  background: rgba(24, 144, 255, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
