<template>
  <div class="demo-wrap">
    <xy-rich-text-editor
      ref="editorRef"
      v-model="content"
      placeholder="点击 AI 补全按钮模拟流式生成..."
    >
      <template #default="{ editor }">
        <div v-if="editor" class="demo-toolbar">
          <button class="demo-btn" :disabled="loading" @click="triggerAICompletion(editor)">
            <span v-if="loading">⏳ 生成中...</span>
            <span v-else>✨ AI 补全</span>
          </button>
          <button class="demo-btn" :disabled="loading" @click="stopCompletion">停止</button>
        </div>
      </template>
    </xy-rich-text-editor>
    <div class="demo-tip">
      提示：这是一个 mock 示例，模拟 AI 流式补全。点击"AI
      补全"按钮会逐字插入预设文字。实际应用中应通过 fetch / EventSource / WebSocket 调用后端 API。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref('<p>AI 流式补全示例。点击下方按钮开始生成。</p>');
const loading = ref(false);
let timer: number | null = null;

// 预设要"流式"插入的内容
const SAMPLE_TEXT =
  '人工智能（AI）是研究、开发用于模拟、延伸和扩展人类智能的理论、方法、技术及应用系统的一门新的技术科学。';

const triggerAICompletion = (editor: any) => {
  if (loading.value) return;

  loading.value = true;

  // 先插入一个空格
  editor.chain().focus().insertContent(' ').run();

  let index = 0;
  timer = window.setInterval(() => {
    if (index >= SAMPLE_TEXT.length) {
      stopCompletion();
      return;
    }
    // 每次插入 1-3 个字符（模拟随机速度）
    const step = Math.floor(Math.random() * 3) + 1;
    const chunk = SAMPLE_TEXT.slice(index, index + step);
    editor.chain().focus().insertContent(chunk).run();
    index += step;
  }, 80);
};

const stopCompletion = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  loading.value = false;
};
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
  gap: 4px;
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px 6px 0 0;
  border-bottom: none;
}
.demo-btn {
  height: 28px;
  padding: 0 12px;
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
.demo-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
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
