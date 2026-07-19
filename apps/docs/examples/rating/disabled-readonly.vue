<template>
  <xy-space direction="vertical">
    <div>
      <span class="demo-label">禁用：</span>
      <xy-rating :value="3" disabled />
    </div>
    <div>
      <span class="demo-label">只读：</span>
      <xy-rating :value="4" readonly />
    </div>
    <div>
      <span class="demo-label">禁用且选中：</span>
      <xy-rating :value="2" disabled />
    </div>
  </xy-space>
</template>
<script lang="ts" setup>
// 禁用与只读：disabled 时无法交互；readonly 时仅展示分值。
</script>
<style scoped>
.demo-label {
  display: inline-block;
  width: 100px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
