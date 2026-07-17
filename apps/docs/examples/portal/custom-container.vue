<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-space>
      <xy-button type="primary" @click="visible = !visible">切换浮层</xy-button>
      <xy-radio-group v-model:value="target">
        <xy-radio value="custom-1">挂载到容器 1</xy-radio>
        <xy-radio value="custom-2">挂载到容器 2</xy-radio>
      </xy-radio-group>
    </xy-space>

    <div class="container-grid">
      <div id="custom-1" class="mount-container">
        <span class="container-label">容器 1（#custom-1）</span>
      </div>
      <div id="custom-2" class="mount-container">
        <span class="container-label">容器 2（#custom-2）</span>
      </div>
    </div>

    <xy-portal :append-to="target">
      <div v-if="visible" class="mounted-card">
        当前挂载点：{{ target }}
        <xy-button size="small" @click="visible = false">关闭</xy-button>
      </div>
    </xy-portal>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const visible = ref(false);
const target = ref('custom-1');
</script>
<style scoped>
.container-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.mount-container {
  position: relative;
  height: 160px;
  padding: 12px;
  border: 1px dashed #1677ff;
  border-radius: 8px;
  background: #f0f5ff;
}
.container-label {
  color: #1677ff;
  font-size: 12px;
}
.mounted-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}
</style>
