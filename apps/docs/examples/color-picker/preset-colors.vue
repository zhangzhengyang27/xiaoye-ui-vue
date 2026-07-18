<!-- 预设色板：自定义 Ant 主题色板，点击色块即应用到 color-picker -->
<template>
  <xy-space direction="vertical" :size="16">
    <div class="demo-row">
      <span class="demo-label">当前颜色：</span>
      <xy-color-picker v-model="color" :default-color="color || defaultColor" />
      <span class="demo-current">
        <span class="demo-swatch" :style="{ background: color ? `#${color}` : '#fff' }" />
        <xy-typography-text code>{{ color ? `#${color}` : '未选择' }}</xy-typography-text>
      </span>
    </div>

    <div class="demo-presets">
      <div class="demo-presets-title">预设色板（Ant 主题色）</div>
      <div class="demo-presets-grid">
        <button
          v-for="item in presets"
          :key="item.value"
          type="button"
          class="demo-preset"
          :class="{
            'demo-preset-active': color && color.toLowerCase() === item.value.toLowerCase(),
          }"
          :style="{ background: `#${item.value}` }"
          :title="`${item.name} · #${item.value}`"
          @click="onSelect(item.value)"
        />
      </div>
    </div>

    <p class="demo-tip">
      ColorPicker 未内置
      <code>presets</code>
      属性时，可通过外部色板配合
      <code>v-model</code>
      实现预设颜色，点击色块即可应用。
    </p>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// Ant Design 主题色板
const presets = [
  { name: '红', value: 'f5222d' },
  { name: '火山', value: 'fa541c' },
  { name: '橙', value: 'fa8c16' },
  { name: '金', value: 'faad14' },
  { name: '黄', value: 'fadb14' },
  { name: '青柠', value: 'a0d911' },
  { name: '绿', value: '52c41a' },
  { name: '青', value: '13c2c2' },
  { name: '蓝', value: '1890ff' },
  { name: '极客蓝', value: '2f54eb' },
  { name: '紫', value: '722ed1' },
  { name: '品红', value: 'eb2f96' },
];

const defaultColor = ref('1890ff');
const color = ref<string>('1890ff');

const onSelect = (value: string) => {
  color.value = value;
};
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
  width: 80px;
}
.demo-current {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.demo-swatch {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
.demo-presets {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
  max-width: 360px;
}
.demo-presets-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}
.demo-presets-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}
.demo-preset {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition:
    transform 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
}
.demo-preset:hover {
  transform: scale(1.08);
}
.demo-preset-active {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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
