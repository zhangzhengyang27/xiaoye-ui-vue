<template>
  <div>
    <a-tag>Tag 1</a-tag>
    <a-tag><a href="https://github.com/xiaoye-ui/xiaoye-ui">Link</a></a-tag>
    <a-tag closable @close="log">Tag 2</a-tag>
    <a-tag closable @close.prevent>Prevent Default</a-tag>
  </div>
</template>
<script lang="ts" setup>
const log = (e: MouseEvent) => {
  console.log(e);
};
</script>
