<template>
  <xy-affix :offset-top="120" @change="change">
    <xy-button>120px to affix top</xy-button>
  </xy-affix>
</template>
<script lang="ts" setup>
const change = (affixed: boolean) => {
  console.log(affixed);
};
</script>
