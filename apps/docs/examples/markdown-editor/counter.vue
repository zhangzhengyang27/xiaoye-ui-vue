<template>
  <div class="demo-markdown-editor-wrap">
    <div class="demo-controls">
      <span>启用计数器：</span>
      <xy-switch v-model:checked="enable" />
      <span class="demo-control-divider">|</span>
      <span>统计类型：</span>
      <xy-radio-group v-model:value="counterType" button-style="solid">
        <xy-radio-button value="markdown">markdown（源码字数）</xy-radio-button>
        <xy-radio-button value="text">text（纯文本字数）</xy-radio-button>
      </xy-radio-group>
    </div>
    <xy-markdown-editor
      :key="`${enable}-${counterType}`"
      v-model="content"
      :counter="counterConfig"
      :height="320"
    />
    <div class="demo-tip">
      通过
      <code>counter</code>
      属性配置字数统计：当前上限为
      <code>200</code>
      ，达到上限时编辑器会阻止继续输入。 切换统计类型或开关会重建编辑器实例以应用新配置。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

const enable = ref(true);
const counterType = ref<'markdown' | 'text'>('markdown');

// 计数器配置：max 达到时编辑器会阻止继续输入
const counterConfig = computed(() => ({
  enable: enable.value,
  max: 200,
  type: counterType.value,
}));

// 初始文本接近 max，让用户立即看到计数效果
const content = ref(`# 计数器示例

计数器（counter）用于限制编辑器内容的字数。当字数接近上限时，右下角计数器会变红提示；达到上限后，编辑器会阻止继续输入。

## 配置项

- \`enable\`：是否启用计数器
- \`max\`：最大字数限制
- \`type\`：统计类型，\`markdown\` 统计源码字数，\`text\` 统计渲染后纯文本字数

试着继续输入内容，观察右下角计数器变化。`);
</script>

<style scoped>
.demo-markdown-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  flex-wrap: wrap;
}
.demo-control-divider {
  color: #d9d9d9;
  margin: 0 4px;
}
.demo-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.6;
}
.demo-tip code {
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
