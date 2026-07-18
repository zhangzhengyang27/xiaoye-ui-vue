<template>
  <div class="demo-wrap">
    <xy-rich-text-editor v-model="content" placeholder="选中文本后设置颜色...">
      <template #default="{ editor, handlers }">
        <div v-if="editor" class="demo-toolbar">
          <span class="demo-label">文字颜色：</span>
          <button
            v-for="color in colors"
            :key="color.value || 'clear'"
            class="demo-color-btn"
            :style="{ background: color.value || 'transparent' }"
            :title="color.label"
            @click="handlers.textColor.execute(editor, { color: color.value }).run()"
          />
          <span class="demo-divider"></span>
          <button class="demo-btn" @click="handlers.textColor.execute(editor, { color: '' }).run()">
            清除颜色
          </button>
        </div>
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">提示：选中文字后点击色块设置颜色。</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('<p>选中一段文字，点击下方色块设置颜色。</p>');

const colors = [
  { label: '红色', value: '#ef4444' },
  { label: '橙色', value: '#f97316' },
  { label: '黄色', value: '#eab308' },
  { label: '绿色', value: '#22c55e' },
  { label: '蓝色', value: '#3b82f6' },
  { label: '紫色', value: '#8b5cf6' },
  { label: '粉色', value: '#ec4899' },
  { label: '黑色', value: '#000000' },
];
</script>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px 6px 0 0;
  border-bottom: none;
  flex-wrap: wrap;
}
.demo-label {
  font-size: 12px;
  color: #666;
  margin-right: 4px;
}
.demo-color-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  transition: all 0.15s;
}
.demo-color-btn:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.demo-btn {
  height: 28px;
  padding: 0 10px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.demo-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}
.demo-divider {
  width: 1px;
  height: 18px;
  background: #e8e8e8;
  margin: 0 4px;
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
