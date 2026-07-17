<template>
  <xy-space direction="vertical" :size="16">
    <xy-space wrap>
      <xy-ripple class="demo-box">
        <button class="demo-btn">点击我（涟漪）</button>
      </xy-ripple>
      <xy-ripple class="demo-box">
        <button class="demo-btn primary">主要按钮</button>
      </xy-ripple>
      <xy-ripple class="demo-box">
        <button class="demo-btn">普通按钮</button>
      </xy-ripple>
    </xy-space>

    <xy-alert type="info" show-icon message="点击按钮可观察到从点击位置扩散的涟漪效果。" />
  </xy-space>
</template>
<script lang="ts" setup></script>
<style scoped>
.demo-box {
  display: inline-block;
}
.demo-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.demo-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}
.demo-btn.primary {
  background: #1677ff;
  border-color: #1677ff;
  color: #fff;
}
.demo-btn.primary:hover {
  background: #4096ff;
}
</style>
