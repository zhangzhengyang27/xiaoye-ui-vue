<template>
  <div class="demo-markdown-editor-wrap">
    <div class="demo-controls">
      <span>界面语言：</span>
      <xy-radio-group v-model:value="lang" button-style="solid">
        <xy-radio-button value="zh_CN">简体中文</xy-radio-button>
        <xy-radio-button value="en_US">English</xy-radio-button>
        <xy-radio-button value="ja_JP">日本語</xy-radio-button>
        <xy-radio-button value="ko_KR">한국어</xy-radio-button>
      </xy-radio-group>
    </div>
    <xy-markdown-editor :key="lang" v-model="content" :lang="lang" :height="320" />
    <div class="demo-tip">
      通过
      <code>lang</code>
      属性切换编辑器界面语言（工具栏、提示、菜单等）。 切换语言时通过
      <code>:key</code>
      强制重建编辑器实例。 Vditor 内置 20+ 语言，可在
      <a href="https://github.com/Vanessa219/vditor/tree/master/dist/i18n" target="_blank">
        i18n 目录
      </a>
      查看完整列表。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const lang = ref<'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR'>('zh_CN');

// 内容保持简短，让用户聚焦于工具栏语言变化
const content = ref(`# 你好，世界

欢迎使用 XiaoyeUI MarkdownEditor。请观察上方工具栏按钮的提示文本随语言切换而变化。`);
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
.demo-tip a {
  color: #1890ff;
  text-decoration: none;
}
.demo-tip a:hover {
  text-decoration: underline;
}
</style>
