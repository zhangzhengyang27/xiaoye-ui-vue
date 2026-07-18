<template>
  <div class="inline-edit-basic">
    <p class="label">用户名</p>
    <xy-inline-edit
      v-model="value"
      placeholder="点击输入用户名"
      @save="onSave"
      @cancel="onCancel"
    />
    <p class="tip">
      当前值：
      <strong>{{ value || '（空）' }}</strong>
    </p>
    <p class="tip">操作提示：点击文字进入编辑；Enter 保存，Esc 取消，点击外部也会保存。</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

// 当前值，支持 v-model 双向绑定
const value = ref('张三');

function onSave(val: any) {
  message.success(`已保存：${val}`);
}

function onCancel(val: any) {
  message.info(`已取消，恢复为：${val}`);
}
</script>

<style scoped>
.inline-edit-basic .label {
  margin-bottom: 8px;
  color: #666;
}
.inline-edit-basic .tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}
</style>
