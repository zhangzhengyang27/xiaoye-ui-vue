<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="体验完整工具栏...">
      <template #default="{ editor }">
        <xy-rich-text-editor-toolbar v-if="editor" :editor="editor" :items="items" />
      </template>
    </xy-rich-text-editor>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { defaultToolbarItems } from 'xiaoye-ui/rich-text-editor';

const content = ref(
  '<h2>完整工具栏示例</h2><p>包含 7 组工具：历史操作、块类型、文本格式、链接/图片/表格、文本对齐、文字颜色/高亮、清除格式。</p><p>每组之间会自动渲染分隔符，dropdown 内部支持嵌套 separator 与 label。</p>',
);

const items = defaultToolbarItems;
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
}
</style>
