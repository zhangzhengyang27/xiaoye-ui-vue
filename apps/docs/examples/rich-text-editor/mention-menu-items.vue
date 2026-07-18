<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="输入 @ 触发异步加载用户列表...">
      <template #default="{ editor }">
        <xy-rich-text-editor-mention-menu
          v-if="editor"
          v-model:search-term="searchTerm"
          :editor="editor"
          :items="filteredItems"
          :char="'@'"
          :ignore-filter="true"
          :limit="10"
        />
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">
      <div>
        当前搜索词：
        <code>{{ searchTerm || '(空)' }}</code>
      </div>
      <div>异步加载结果：{{ filteredItems.length }} 条</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const content = ref('<p>异步加载提及示例。</p>');
const searchTerm = ref('');
const filteredItems = ref<any[]>([]);

// 模拟全量用户数据
const ALL_USERS = [
  { label: '张三', description: '产品经理', id: 'user-1' },
  { label: '李四', description: '前端工程师', id: 'user-2' },
  { label: '王五', description: '后端工程师', id: 'user-3' },
  { label: '赵六', description: '设计师', id: 'user-4' },
  { label: '孙七', description: '测试工程师', id: 'user-5' },
  { label: '周八', description: '运维工程师', id: 'user-6' },
  { label: '吴九', description: '数据分析师', id: 'user-7' },
  { label: '郑十', description: '项目经理', id: 'user-8' },
];

// 模拟异步加载
const loadUsers = (query: string) => {
  setTimeout(() => {
    if (!query) {
      filteredItems.value = ALL_USERS.slice(0, 5);
      return;
    }
    filteredItems.value = ALL_USERS.filter(
      u => u.label.includes(query) || u.description.includes(query),
    ).slice(0, 10);
  }, 300); // 模拟网络延迟
};

watch(searchTerm, loadUsers, { immediate: true });
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
