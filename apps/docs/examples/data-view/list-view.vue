<template>
  <xy-data-view :value="messages" layout="list">
    <template #list="{ items }">
      <div class="list">
        <div v-for="item in items" :key="item.id" class="row">
          <xy-avatar :size="36">{{ item.sender.slice(0, 1) }}</xy-avatar>
          <div class="content">
            <div class="top">
              <span class="sender">{{ item.sender }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
            <div class="preview">{{ item.preview }}</div>
          </div>
        </div>
      </div>
    </template>
  </xy-data-view>
</template>

<script lang="ts" setup>
interface Message {
  id: number;
  sender: string;
  preview: string;
  time: string;
}

const messages: Message[] = [
  { id: 1, sender: '张伟', preview: '关于本周项目进度的同步，请查阅附件。', time: '09:24' },
  { id: 2, sender: '李娜', preview: '设计稿已更新到 v2，请前端同学评估。', time: '10:08' },
  { id: 3, sender: '王强', preview: '组件库的单元测试已全部通过。', time: '11:32' },
  { id: 4, sender: '赵敏', preview: '后端接口联调完成，可以进入提测。', time: '14:05' },
  { id: 5, sender: '陈晨', preview: '市场活动数据周报已生成。', time: '16:47' },
];
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.row {
  display: flex;
  gap: 12px;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.content {
  flex: 1;
  min-width: 0;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sender {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}
.time {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.preview {
  margin-top: 4px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
