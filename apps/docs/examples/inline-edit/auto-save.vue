<template>
  <div class="inline-edit-auto-save">
    <p class="label">实时备注（自动保存）</p>
    <xy-inline-edit v-model="value" auto-save placeholder="输入即保存" @save="onSave" />
    <p class="tip">
      当前值：
      <strong>{{ value || '（空）' }}</strong>
    </p>
    <p class="tip">
      保存次数：
      <strong>{{ saveCount }}</strong>
    </p>
    <p class="tip">操作提示：autoSave 模式下每次输入即触发 change 与 save，并保留编辑态。</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 自动保存：每次输入都会触发 save，无需手动确认
const value = ref('自动保存的初始值');
const saveCount = ref(0);

function onSave() {
  saveCount.value += 1;
}
</script>

<style scoped>
.inline-edit-auto-save .label {
  margin-bottom: 8px;
  color: #666;
}
.inline-edit-auto-save .tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}
</style>
