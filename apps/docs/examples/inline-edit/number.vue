<template>
  <div class="inline-edit-number">
    <p class="label">数量</p>
    <xy-inline-edit v-model="value" type="number" placeholder="点击输入数量" @save="onSave" />
    <p class="tip">
      当前值：
      <strong>{{ value }}</strong>
      （类型：{{ typeof value }}）
    </p>
    <p class="tip">操作提示：数字类型保存时会自动归一化为 number。</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

// 数字编辑，保存时自动归一化为 number 类型
const value = ref(10);

function onSave(val: any) {
  message.success(`已保存：${val}（${typeof val}）`);
}
</script>

<style scoped>
.inline-edit-number .label {
  margin-bottom: 8px;
  color: #666;
}
.inline-edit-number .tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}
</style>
