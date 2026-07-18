<template>
  <div class="inline-edit-text-area">
    <p class="label">备注</p>
    <xy-inline-edit v-model="value" type="textarea" placeholder="点击输入多行备注" @save="onSave" />
    <p class="tip">当前备注：</p>
    <pre class="preview">{{ value || '（空）' }}</pre>
    <p class="tip">
      操作提示：Enter 换行；Ctrl/Shift/Cmd + Enter 保存，Esc 取消，点击外部也会保存。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

// 多行文本编辑，type=textarea 时使用 xy-textarea 作为编辑器
const value = ref('第一行\n第二行');

function onSave() {
  message.success('备注已保存');
}
</script>

<style scoped>
.inline-edit-text-area .label {
  margin-bottom: 8px;
  color: #666;
}
.inline-edit-text-area .tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}
.inline-edit-text-area .preview {
  margin: 4px 0 0;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-wrap;
}
</style>
