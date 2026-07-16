<template>
  <a-space>
    <icon-font type="icon-tuichu" />
    <icon-font type="icon-facebook" />
    <icon-font type="icon-twitter" />
  </a-space>
</template>
<script lang="ts" setup>
import { createFromIconfontCN } from '@ant-design/icons-vue';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});
</script>
<style scoped>
.icons-list :deep(.anticon) {
  margin-right: 6px;
  font-size: 24px;
}
</style>
