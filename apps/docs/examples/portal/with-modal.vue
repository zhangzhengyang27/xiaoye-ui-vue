<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-alert
      type="info"
      show-icon
      message="Portal 常用于自定义浮层场景。下方演示一个通过 Portal 实现的自定义确认弹层，可避免被表格等 overflow 容器裁剪。"
    />

    <div class="table-frame">
      <xy-table :columns="columns" :data-source="data" :pagination="false" size="small">
        <template #bodyCell="{ record, column }">
          <template v-if="column.key === 'action'">
            <xy-button type="link" size="small" @click="openConfirm(record)">删除</xy-button>
          </template>
        </template>
      </xy-table>
    </div>

    <xy-portal>
      <transition name="fade">
        <div v-if="confirmVisible" class="confirm-mask" @click.self="cancel">
          <div class="confirm-box">
            <div class="confirm-title">
              <ExclamationCircleOutlined style="color: #faad14; margin-right: 8px" />
              确认删除
            </div>
            <div class="confirm-content">
              确定要删除用户「{{ targetRecord?.name }}」吗？此操作不可撤销。
            </div>
            <div class="confirm-actions">
              <xy-button @click="cancel">取消</xy-button>
              <xy-button type="primary" danger @click="confirmDelete">确定删除</xy-button>
            </div>
          </div>
        </div>
      </transition>
    </xy-portal>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { ExclamationCircleOutlined } from '@xiaoye-ui/icons';
import { message } from 'xiaoye-ui';

interface UserRecord {
  key: number;
  name: string;
  age: number;
  address: string;
}

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '地址', dataIndex: 'address', key: 'address' },
  { title: '操作', key: 'action' },
];

const data = ref<UserRecord[]>([
  { key: 1, name: '张三', age: 28, address: '北京市海淀区' },
  { key: 2, name: '李四', age: 32, address: '上海市浦东新区' },
  { key: 3, name: '王五', age: 25, address: '深圳市南山区' },
]);

const confirmVisible = ref(false);
const targetRecord = ref<UserRecord | null>(null);

function openConfirm(record: UserRecord) {
  targetRecord.value = record;
  confirmVisible.value = true;
}

function cancel() {
  confirmVisible.value = false;
  targetRecord.value = null;
}

function confirmDelete() {
  if (targetRecord.value) {
    data.value = data.value.filter(item => item.key !== targetRecord.value!.key);
    message.success(`已删除用户「${targetRecord.value.name}」`);
  }
  cancel();
}
</script>
<style scoped>
.table-frame {
  max-height: 200px;
  overflow: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}
.confirm-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-box {
  width: 400px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}
.confirm-title {
  font-size: 16px;
  font-weight: 500;
}
.confirm-content {
  margin: 12px 0 20px 24px;
  color: #595959;
}
.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
