<template>
  <div class="demo-wrap">
    <xy-rich-text-editor
      v-model="content"
      :code-block-shiki="shikiOptions"
      :starter-kit="{ codeBlock: false }"
      placeholder="使用代码块按钮插入代码，自动语法高亮..."
    >
      <template #default="{ editor, handlers }">
        <div v-if="editor" class="demo-toolbar">
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.bold.isActive(editor) }"
            @click="handlers.bold.execute(editor).run()"
          >
            B
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.italic.isActive(editor) }"
            @click="handlers.italic.execute(editor).run()"
          >
            <em>I</em>
          </button>
          <span class="demo-divider"></span>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.codeBlock.isActive(editor) }"
            :disabled="handlers.codeBlock.isDisabled?.(editor)"
            title="代码块"
            @click="handlers.codeBlock.execute(editor).run()"
          >
            代码块
          </button>
          <button
            type="button"
            class="demo-btn"
            :class="{ 'is-active': handlers.blockquote.isActive(editor) }"
            title="引用"
            @click="handlers.blockquote.execute(editor).run()"
          >
            引用
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
    <p class="demo-tip">
      `codeBlockShiki` 默认开启，使用 Shiki 进行代码语法高亮。可通过对象配置自定义主题（如
      `material-theme-palenight`）。下方代码块会带语法高亮渲染。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const shikiOptions = ref({
  defaultTheme: 'material-theme-palenight',
  themes: {
    light: 'material-theme-lighter',
    dark: 'material-theme-palenight',
  },
});

const content = ref(`<pre><code class="language-typescript">function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('XiaoyeUI'));</code></pre><p>上方为代码块示例，使用 Shiki 进行语法高亮。</p>`);
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px 6px 0 0;
  border-bottom: none;
}
.demo-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.demo-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}
.demo-btn.is-active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}
.demo-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.demo-divider {
  width: 1px;
  height: 20px;
  background: #e8e8e8;
  margin: 0 4px;
}
.demo-tip {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
