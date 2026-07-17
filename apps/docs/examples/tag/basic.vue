<template>
  <div>
    <xy-tag>Tag 1</xy-tag>
    <xy-tag><a href="https://github.com/xiaoye-ui/xiaoye-ui">Link</a></xy-tag>
    <xy-tag closable @close="log">Tag 2</xy-tag>
    <xy-tag closable @close.prevent>Prevent Default</xy-tag>
  </div>
</template>
<script lang="ts" setup>
const log = (e: MouseEvent) => {
  console.log(e);
};
</script>
