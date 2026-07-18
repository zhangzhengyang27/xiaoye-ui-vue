<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="输入 @ 触发提及菜单...">
      <template #default="{ editor }">
        <xy-rich-text-editor-mention-menu
          v-if="editor"
          :editor="editor"
          :items="items"
          :char="'@'"
        />
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">
      提示：在编辑器中输入
      <code>@</code>
      会弹出用户列表。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('<p>开始输入，@某人 召唤提及菜单。</p>');

const items = [
  {
    label: '张三',
    description: '产品经理',
    id: 'user-1',
    email: 'zhangsan@example.com',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/1?v=4',
      shape: 'circle',
      size: 'small',
    },
  },
  {
    label: '李四',
    description: '前端工程师',
    id: 'user-2',
    email: 'lisi@example.com',
    avatar: {
      image: 'https://avatars.githubusercontent.com/u/2?v=4',
    },
  },
  {
    label: '王五',
    description: '后端工程师',
    id: 'user-3',
    email: 'wangwu@example.com',
  },
  {
    label: '赵六',
    description: '设计师',
    id: 'user-4',
    email: 'zhaoliu@example.com',
    avatar: {
      label: '赵',
    },
  },
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
.demo-tip code {
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  color: #c41d7f;
}
</style>
