<template>
  <xy-space direction="vertical" :size="16">
    <xy-space align="center">
      <xy-switch v-model:checked="disabled" checked-children="禁用" un-checked-children="启用" />
      <span class="tip">当前状态：{{ disabled ? '已禁用涟漪' : '已启用涟漪' }}</span>
    </xy-space>

    <xy-space wrap>
      <xy-ripple class="demo-box" :disabled="disabled">
        <button class="demo-btn">按钮 A</button>
      </xy-ripple>
      <xy-ripple class="demo-box" :disabled="disabled">
        <button class="demo-btn primary">按钮 B</button>
      </xy-ripple>
      <xy-ripple class="demo-box" :disabled="disabled">
        <button class="demo-btn">按钮 C</button>
      </xy-ripple>
    </xy-space>

    <xy-alert
      type="info"
      show-icon
      message="通过 disabled 属性可关闭涟漪效果，对比启用与禁用状态下的点击差异。"
    />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const disabled = ref(false);
</script>
<style scoped>
.demo-box {
  display: inline-block;
}
.tip {
  color: #888;
}
.demo-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.demo-btn.primary {
  background: #1677ff;
  border-color: #1677ff;
  color: #fff;
}
</style>
