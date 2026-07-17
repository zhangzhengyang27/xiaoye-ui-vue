<template>
  <xy-space direction="vertical" :size="16">
    <xy-space wrap>
      <xy-ripple class="demo-box">
        <button class="demo-btn">默认颜色</button>
      </xy-ripple>
      <xy-ripple class="demo-box ink-primary">
        <button class="demo-btn">主色涟漪</button>
      </xy-ripple>
      <xy-ripple class="demo-box ink-red">
        <button class="demo-btn">红色涟漪</button>
      </xy-ripple>
      <xy-ripple class="demo-box ink-green">
        <button class="demo-btn">绿色涟漪</button>
      </xy-ripple>
      <xy-ripple class="demo-box ink-white">
        <button class="demo-btn dark">深色按钮白色涟漪</button>
      </xy-ripple>
    </xy-space>

    <xy-alert
      type="info"
      show-icon
      message="通过覆盖 .xy-ripple__ink 的 background 即可自定义涟漪颜色。"
    />
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
}
.demo-btn.dark {
  background: #1f1f1f;
  border-color: #1f1f1f;
  color: #fff;
}
.ink-primary :deep(.xy-ripple__ink) {
  background: rgba(22, 119, 255, 0.35);
}
.ink-red :deep(.xy-ripple__ink) {
  background: rgba(245, 34, 45, 0.35);
}
.ink-green :deep(.xy-ripple__ink) {
  background: rgba(82, 196, 26, 0.35);
}
.ink-white :deep(.xy-ripple__ink) {
  background: rgba(255, 255, 255, 0.5);
}
</style>
