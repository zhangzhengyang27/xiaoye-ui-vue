<template>
  <div class="inline-edit-controlled">
    <p class="label">昵称</p>
    <xy-inline-edit
      ref="editRef"
      v-model="value"
      v-model:editable="editable"
      placeholder="点击编辑"
      @save="onSave"
      @cancel="onCancel"
    />
    <div class="actions">
      <xy-button size="small" @click="enter">外部进入编辑</xy-button>
      <xy-button size="small" type="primary" @click="save">外部保存</xy-button>
      <xy-button size="small" @click="cancel">外部取消</xy-button>
    </div>
    <p class="tip">
      当前值：
      <strong>{{ value || '（空）' }}</strong>
      ，编辑态：
      <strong>{{ editable ? '编辑中' : '展示中' }}</strong>
    </p>
    <p class="tip">
      操作提示：通过 v-model:editable 可在外部控制编辑状态，也可调用组件方法主动进入/保存/取消。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'xiaoye-ui';

// 受控编辑态：通过 v-model:editable 在外部控制
const value = ref('小明');
const editable = ref(false);

// 组件实例引用：调用暴露的 edit/save/cancel 方法
const editRef = ref<any>(null);

function enter() {
  editRef.value?.edit();
}

function save() {
  editRef.value?.save();
}

function cancel() {
  editRef.value?.cancel();
}

function onSave(val: any) {
  message.success(`已保存：${val}`);
}

function onCancel(val: any) {
  message.info(`已取消，恢复为：${val}`);
}
</script>

<style scoped>
.inline-edit-controlled .label {
  margin-bottom: 8px;
  color: #666;
}
.inline-edit-controlled .actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
.inline-edit-controlled .tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}
</style>
