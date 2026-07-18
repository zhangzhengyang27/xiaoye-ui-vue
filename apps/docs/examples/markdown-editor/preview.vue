<template>
  <div class="demo-markdown-editor-wrap">
    <div class="demo-controls">
      <span>同步预览：</span>
      <xy-switch v-model:checked="syncPreview" />
      <span class="demo-control-divider" />
      <span class="demo-control-hint">关闭后下方预览不再实时同步</span>
    </div>

    <div class="demo-section">
      <div class="demo-section-title">编辑区</div>
      <xy-markdown-editor v-model="content" :height="300" />
    </div>

    <div class="demo-section">
      <div class="demo-section-title">预览区（只读）</div>
      <xy-markdown-editor
        :key="syncPreview ? 'sync' : 'frozen'"
        v-model="previewContent"
        :height="300"
        readonly
      />
    </div>

    <div class="demo-tip">
      预览模式适合内容详情页、评论渲染、文章展示等场景：通过
      <code>readonly</code>
      属性禁用编辑， 并通过
      <code>v-model</code>
      双向同步上方编辑区内容。关闭「同步预览」开关可冻结下方内容，便于对比修改前后效果。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const content = ref(`# 预览模式示例

上方为可编辑区，下方为只读预览区，内容通过 \`v-model\` 实时同步。

## 语法展示

### 代码块

\`\`\`javascript
const sum = (a, b) => a + b;
console.log(sum(1, 2));
\`\`\`

### 引用

> 这是一段引用文本。

### 列表

- 苹果
- 香蕉
- 橙子

### 表格

| 名称 | 价格 |
| ---- | ---- |
| 苹果 | 5.0  |
| 香蕉 | 3.5  |

### 强调

支持 **加粗**、*斜体*、~~删除线~~、\`行内代码\`。

修改上方编辑区，下方预览区会实时同步显示渲染结果。
`);

// 预览区内容：开启同步预览时跟随编辑区
const previewContent = ref(content.value);
const syncPreview = ref(true);

watch(content, value => {
  if (syncPreview.value) {
    previewContent.value = value;
  }
});
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
}
.demo-control-divider {
  display: inline-block;
  width: 16px;
}
.demo-control-hint {
  font-size: 12px;
  color: #999;
}
.demo-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.demo-section-title {
  font-size: 13px;
  font-weight: 500;
  color: #555;
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
