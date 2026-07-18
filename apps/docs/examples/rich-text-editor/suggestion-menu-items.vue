<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="输入 / 触发自定义命令菜单...">
      <template #default="{ editor }">
        <xy-rich-text-editor-suggestion-menu
          v-if="editor"
          :editor="editor"
          :items="items"
          :char="'/'"
          :limit="20"
        />
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">
      提示：自定义 items，每个 item 可以包含 icon（SVG 字符串）、description、disabled 等字段。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('<p>自定义斜杠命令示例。</p>');

// SVG 图标字符串
const ICON = {
  heading:
    '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h12"/><path d="M6 20V4"/><path d="M18 20V4"/></svg>',
  list: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  image:
    '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  quote:
    '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
  table:
    '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>',
};

const items = [
  [
    { type: 'label', label: '常用' },
    {
      kind: 'heading',
      level: 1,
      label: '标题 1',
      description: '快捷键 mod+alt+1',
      icon: ICON.heading,
    },
    {
      kind: 'heading',
      level: 2,
      label: '标题 2',
      description: '快捷键 mod+alt+2',
      icon: ICON.heading,
    },
    {
      kind: 'heading',
      level: 3,
      label: '标题 3',
      description: '快捷键 mod+alt+3',
      icon: ICON.heading,
    },
  ],
  [
    { type: 'label', label: '列表与引用' },
    { kind: 'bulletList', label: '无序列表', description: '• 项目一', icon: ICON.list },
    { kind: 'orderedList', label: '有序列表', description: '1. 项目一', icon: ICON.list },
    { kind: 'blockquote', label: '引用', description: '插入引用块', icon: ICON.quote },
  ],
  [
    { type: 'label', label: '插入' },
    {
      kind: 'codeBlock',
      label: '代码块',
      description: '语法高亮代码',
      icon: ICON.code,
      disabled: false,
    },
    { kind: 'image', label: '图片', description: '上传或粘贴图片', icon: ICON.image },
    { kind: 'insertTable', label: '表格', description: '插入 3x3 表格', icon: ICON.table },
    { kind: 'horizontalRule', label: '分割线', description: '---' },
  ],
];
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-tip {
  font-size: 12px;
  color: #999;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}
</style>
