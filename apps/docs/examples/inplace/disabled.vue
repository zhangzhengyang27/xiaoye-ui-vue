<template>
  <div class="inplace-disabled">
    <xy-inplace disabled>
      <template #display>
        <span class="display-text">{{ text }}</span>
      </template>
      <template #content>
        <span>编辑内容（禁用状态下不可达）</span>
      </template>
    </xy-inplace>
  </div>
</template>

<script lang="ts" setup>
const text = '禁用状态，无法进入编辑模式';
</script>

<style scoped>
.inplace-disabled .display-text {
  color: #999;
  cursor: not-allowed;
}
</style>
