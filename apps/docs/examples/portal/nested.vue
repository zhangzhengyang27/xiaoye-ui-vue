<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-button type="primary" @click="outer = !outer">切换外层浮层</xy-button>

    <xy-portal>
      <div v-if="outer" class="outer-card">
        <div class="card-header">
          <span>外层浮层（已传送到 body）</span>
          <xy-button size="small" type="text" @click="outer = false">关闭</xy-button>
        </div>
        <div class="card-body">
          <p>
            外层浮层内部同样设置了
            <code>overflow: hidden</code>
            。
          </p>
          <xy-button @click="inner = !inner">切换内层浮层</xy-button>

          <xy-portal>
            <div v-if="inner" class="inner-card">
              <span>内层浮层（再次传送到 body，跳出外层裁剪）</span>
              <xy-button size="small" @click="inner = false">关闭</xy-button>
            </div>
          </xy-portal>
        </div>
      </div>
    </xy-portal>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const outer = ref(false);
const inner = ref(false);
</script>
<style scoped>
.outer-card {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 360px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.inner-card {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  width: 280px;
  padding: 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}
</style>
