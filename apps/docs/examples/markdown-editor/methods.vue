<template>
  <div class="demo-markdown-editor-wrap">
    <xy-markdown-editor ref="editorRef" v-model="content" :height="300" />

    <!-- 值操作 -->
    <div class="demo-group">
      <div class="demo-group-title">值操作</div>
      <xy-space wrap>
        <xy-button @click="handleGetValue">获取 Markdown</xy-button>
        <xy-button @click="handleGetHTML">获取 HTML</xy-button>
        <xy-button @click="handleSetValue">设置内容</xy-button>
        <xy-button @click="handleInsert">插入文本</xy-button>
        <xy-button @click="handleClearStack">清空 undo 栈</xy-button>
      </xy-space>
    </div>

    <!-- 编辑器控制 -->
    <div class="demo-group">
      <div class="demo-group-title">编辑器控制</div>
      <xy-space wrap>
        <xy-button @click="handleDisable">禁用</xy-button>
        <xy-button @click="handleEnable">启用</xy-button>
        <xy-button @click="handleFocus">聚焦</xy-button>
        <xy-button @click="handleBlur">失焦</xy-button>
        <xy-button @click="handleTip">Tip 提示</xy-button>
      </xy-space>
    </div>

    <!-- 转换 -->
    <div class="demo-group">
      <div class="demo-group-title">转换</div>
      <xy-space wrap>
        <xy-button @click="handleHtml2Md">HTML 转 MD</xy-button>
      </xy-space>
    </div>

    <div class="demo-output">
      <div class="demo-output-title">方法返回值：</div>
      <pre class="demo-output-code">{{ result || '（点击上方按钮查看返回值）' }}</pre>
    </div>

    <div class="demo-tip">
      通过
      <code>ref</code>
      调用编辑器暴露的方法，可在父组件中灵活控制编辑器实例。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const editorRef = ref<any>(null);
const content = ref(`# 方法调用示例

通过 ref 调用编辑器暴露的方法，可以获取内容、设置内容、控制编辑器状态等。

## 可用方法

- \`getValue()\`：获取 Markdown 源码
- \`getHTML()\`：获取渲染后的 HTML
- \`setValue(value, clearStack?)\`：设置内容
- \`insertValue(value, render?)\`：在焦点处插入
- \`disabled()\` / \`enable()\`：禁用/启用
- \`focus()\` / \`blur()\`：聚焦/失焦
- \`clearStack()\`：清空 undo/redo 栈
- \`tip(text, time?)\`：编辑器内提示
- \`html2md(html)\`：HTML 转 Markdown
`);

const result = ref<string>('');

const handleGetValue = () => {
  result.value = editorRef.value?.getValue() ?? '';
};

const handleGetHTML = () => {
  result.value = editorRef.value?.getHTML() ?? '';
};

const handleSetValue = () => {
  editorRef.value?.setValue('# 动态设置的内容\n\n通过 setValue 方法注入。', true);
  result.value = '已调用 setValue("# 动态设置的内容...")';
};

const handleInsert = () => {
  editorRef.value?.insertValue('**插入的加粗文本**');
  result.value = '已调用 insertValue("**插入的加粗文本**")';
};

const handleClearStack = () => {
  editorRef.value?.clearStack();
  result.value = '已清空 undo/redo 栈';
};

const handleDisable = () => {
  editorRef.value?.disabled();
  result.value = '编辑器已禁用';
};

const handleEnable = () => {
  editorRef.value?.enable();
  result.value = '编辑器已启用';
};

const handleFocus = () => {
  editorRef.value?.focus();
  result.value = '已调用 focus()';
};

const handleBlur = () => {
  editorRef.value?.blur();
  result.value = '已调用 blur()';
};

const handleTip = () => {
  editorRef.value?.tip('这是一条提示', 3000);
  result.value = '已调用 tip("这是一条提示", 3000)';
};

const handleHtml2Md = () => {
  const md = editorRef.value?.html2md('<h1>标题</h1><p>段落</p>');
  result.value = md ?? '';
};
</script>

<style scoped>
.demo-markdown-editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.demo-group-title {
  font-size: 13px;
  font-weight: 500;
  color: #555;
}
.demo-output {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 12px;
  background: #fafafa;
}
.demo-output-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}
.demo-output-code {
  margin: 0;
  max-height: 200px;
  overflow: auto;
  font-size: 12px;
  color: #555;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'SFMono-Regular', Consolas, monospace;
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
