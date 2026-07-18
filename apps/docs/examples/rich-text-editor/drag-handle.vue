<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="鼠标 hover 段落会显示左侧拖拽手柄...">
      <template #default="{ editor }">
        <xy-rich-text-editor-drag-handle
          v-if="editor"
          :editor="editor"
          @hover="onNodeChange"
          @node-change="onNodeChange"
        />
      </template>
    </xy-rich-text-editor>
    <div v-if="currentNode" class="demo-info">
      <div class="demo-info-title">当前 hover 节点：</div>
      <pre class="demo-info-code">{{ JSON.stringify(currentNode, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref(
  '<h2>拖拽手柄示例</h2><p>鼠标移动到任意段落、标题或列表上，左侧会出现拖拽手柄。按住手柄可以拖动整块内容重新排序。</p><p>移动端（小于 640px）会自动隐藏手柄。</p>',
);

const currentNode = ref<any>(null);

const onNodeChange = ({ node, pos }: { node: any; pos: number }) => {
  currentNode.value = { node, pos };
};
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-info {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 12px;
  background: #fafafa;
}
.demo-info-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}
.demo-info-code {
  margin: 0;
  max-height: 120px;
  overflow: auto;
  font-size: 12px;
  color: #555;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
</style>
