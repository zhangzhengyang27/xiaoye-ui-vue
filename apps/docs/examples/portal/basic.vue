<template>
  <xy-space direction="vertical" :size="16" style="width: 100%">
    <xy-button type="primary" @click="visible = !visible">
      {{ visible ? '隐藏浮层' : '显示浮层' }}
    </xy-button>

    <div class="overflow-box">
      <p>
        这是一个设置了
        <code>overflow: hidden</code>
        的容器：
      </p>
      <p>如果浮层直接渲染在容器内部，超出部分会被裁剪。</p>
      <p>
        使用
        <code>xy-portal</code>
        默认将浮层传送至
        <code>body</code>
        ，可避免被裁剪。
      </p>

      <xy-portal>
        <div v-if="visible" class="float-card">
          我是经由 Portal 传送到 body 的浮层，不会被父容器 overflow 裁剪。
          <xy-button size="small" @click="visible = false">关闭</xy-button>
        </div>
      </xy-portal>
    </div>

    <xy-alert
      v-if="visible"
      type="info"
      message="浮层已渲染在 body 末尾，可通过浏览器开发者工具查看 DOM 结构。"
      show-icon
    />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const visible = ref(false);
</script>
<style scoped>
.overflow-box {
  height: 140px;
  padding: 16px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
}
.float-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}
</style>
