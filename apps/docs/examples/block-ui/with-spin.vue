<template>
  <div class="block-ui-with-spin">
    <xy-block-ui :blocked="blocked" tip="数据加载中，请稍候...">
      <div class="content">
        <p>
          使用
          <code>tip</code>
          属性或
          <code>#tip</code>
          插槽自定义遮罩下方文案。
        </p>
        <p>
          未传入
          <code>tip</code>
          时，遮罩仅显示默认 Spin 加载图标。
        </p>
        <p>
          也可以通过
          <code>#mask</code>
          插槽完全自定义遮罩内容。
        </p>
      </div>
    </xy-block-ui>

    <div class="actions">
      <xy-button @click="toggle">{{ blocked ? '解除阻塞' : '阻塞容器' }}</xy-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const blocked = ref<boolean>(false);

function toggle() {
  blocked.value = !blocked.value;
}
</script>

<style scoped>
.block-ui-with-spin {
  width: 100%;
}
.content {
  padding: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
  min-height: 120px;
}
.actions {
  margin-top: 16px;
}
code {
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 90%;
}
</style>
