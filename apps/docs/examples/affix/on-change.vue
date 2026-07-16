<template>
  <a-affix :offset-top="120" @change="change">
    <a-button>120px to affix top</a-button>
  </a-affix>
</template>
<script lang="ts" setup>
const change = (affixed: boolean) => {
  console.log(affixed);
};
</script>
