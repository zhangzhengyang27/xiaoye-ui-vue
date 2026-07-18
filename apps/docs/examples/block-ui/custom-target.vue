<template>
  <div class="block-ui-custom-target">
    <div class="toolbar">
      <xy-button @click="blockCard">阻塞卡片</xy-button>
      <xy-button @click="blockList">阻塞列表</xy-button>
      <xy-button type="primary" @click="unblockAll">全部解除</xy-button>
    </div>

    <div class="content">
      <div id="card-target" class="card">
        <h4>卡片容器</h4>
        <p>这里是一些卡片内容。点击「阻塞卡片」按钮后，仅此卡片被阻塞。</p>
      </div>

      <div id="list-target" class="list">
        <h4>列表容器</h4>
        <ul>
          <li>列表项 1</li>
          <li>列表项 2</li>
          <li>列表项 3</li>
        </ul>
      </div>
    </div>

    <!-- 通过 container 指定阻塞目标 -->
    <xy-block-ui :blocked="cardBlocked" container="#card-target" :base-z-index="1000" />
    <xy-block-ui :blocked="listBlocked" container="#list-target" :base-z-index="1000" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const cardBlocked = ref<boolean>(false);
const listBlocked = ref<boolean>(false);

function blockCard() {
  cardBlocked.value = true;
}

function blockList() {
  listBlocked.value = true;
}

function unblockAll() {
  cardBlocked.value = false;
  listBlocked.value = false;
}
</script>

<style scoped>
.block-ui-custom-target {
  width: 100%;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.content {
  display: flex;
  gap: 16px;
}
.card,
.list {
  flex: 1;
  padding: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
  position: relative;
  min-height: 120px;
}
.card h4,
.list h4 {
  margin-top: 0;
}
.list ul {
  margin: 0;
  padding-left: 20px;
}
</style>
