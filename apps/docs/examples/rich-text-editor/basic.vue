<template>
  <div class="demo-wrap">
    <xy-rich-text-editor
      ref="editorRef"
      v-model="content"
      content-type="markdown"
      placeholder="Write, type '/' for commands..."
      class="w-full"
    >
      <template #default="{ editor }">
        <template v-if="editor">
          <xy-rich-text-editor-toolbar
            :editor="editor"
            :items="items"
            class="demo-rich-text-editor-toolbar"
          />

          <xy-rich-text-editor-suggestion-menu
            :editor="editor"
            :items="suggestionItems"
            :char="'/'"
          />
          <xy-rich-text-editor-mention-menu :editor="editor" :items="mentionItems" :char="'@'" />
          <xy-rich-text-editor-emoji-menu
            :editor="editor"
            :items="emojiItems"
            :char="':'"
            :layout="'grid'"
          />
        </template>
      </template>
    </xy-rich-text-editor>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { compactToolbarItems } from 'xiaoye-ui/rich-text-editor';

const editorRef = ref();

const content = ref(`# Building Modern Interfaces with XiaoyeUI

Welcome to the **XiaoyeUI Editor** — a powerful rich text editing experience built on [Tiptap](https://tiptap.dev). This editor combines *flexibility* with ease of use, making content creation a breeze.

## Rich Formatting Options

The editor supports all common text formatting including **bold**, *italic*, <u>underline</u>, ~~strikethrough~~, and \`inline code\`. You can also combine them for **_bold and italic_** text.

### Interactive Features

Try out these powerful capabilities:

- **Slash Commands** — Type \`/\` for quick access to blocks and formatting
- **Mentions** — Use \`@\` to tag people or entities
- **Emoji Picker** — Type \`:\` followed by an emoji name like :smile:

> **Pro tip:** You can use keyboard shortcuts like Cmd/Ctrl + B for bold, Cmd/Ctrl + I for italic, and more!`);

const items = compactToolbarItems;

const suggestionItems = [
  [
    { type: 'label', label: 'Style' },
    { kind: 'paragraph', label: 'Paragraph', icon: 'P' },
    { kind: 'heading', level: 1, label: 'Heading 1', icon: 'H1' },
    { kind: 'heading', level: 2, label: 'Heading 2', icon: 'H2' },
    { kind: 'heading', level: 3, label: 'Heading 3', icon: 'H3' },
    { kind: 'bulletList', label: 'Bullet List', icon: '•' },
    { kind: 'orderedList', label: 'Numbered List', icon: '1.' },
    { kind: 'blockquote', label: 'Blockquote', icon: '"' },
    { kind: 'codeBlock', label: 'Code Block', icon: '</>' },
  ],
  [
    { type: 'label', label: 'Insert' },
    { kind: 'mention', label: 'Mention', icon: '@' },
    { kind: 'emoji', label: 'Emoji', icon: '😊' },
    { kind: 'image', label: 'Image', icon: '🖼' },
    { kind: 'horizontalRule', label: 'Horizontal Rule', icon: '—' },
  ],
];

const mentionItems = [
  {
    label: 'benjamincanac',
    avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4', loading: 'lazy' },
  },
  {
    label: 'HugoRCD',
    avatar: { src: 'https://avatars.githubusercontent.com/u/71938701?v=4', loading: 'lazy' },
  },
  {
    label: 'romhml',
    avatar: { src: 'https://avatars.githubusercontent.com/u/25613751?v=4', loading: 'lazy' },
  },
  {
    label: 'sandros94',
    avatar: { src: 'https://avatars.githubusercontent.com/u/13056429?v=4', loading: 'lazy' },
  },
];

const emojiItems = [
  { name: 'smile', emoji: '😄', shortcodes: ['smile'], tags: ['开心', '笑'] },
  { name: 'grinning', emoji: '😀', shortcodes: ['grinning'], tags: ['开心'] },
  { name: 'joy', emoji: '😂', shortcodes: ['joy'], tags: ['笑'] },
  { name: 'heart', emoji: '❤️', shortcodes: ['heart'], tags: ['爱'] },
  { name: 'thumbsup', emoji: '👍', shortcodes: ['thumbsup'], tags: ['赞'] },
  { name: 'tada', emoji: '🎉', shortcodes: ['tada'], tags: ['庆祝'] },
  { name: 'fire', emoji: '🔥', shortcodes: ['fire'], tags: ['火'] },
  { name: 'star', emoji: '⭐', shortcodes: ['star'], tags: ['星'] },
];
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
}

/* 让工具栏保持 sticky，其余样式由组件默认提供 */
.demo-rich-text-editor-toolbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  overflow-x: auto;
}
</style>
