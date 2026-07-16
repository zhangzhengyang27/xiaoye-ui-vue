<template>
  <div>
    <a-slider :tip-formatter="formatter" />
    <a-slider :tip-formatter="null" />
  </div>
</template>
<script lang="ts" setup>
const formatter = (value: number) => {
  return `${value}%`;
};
</script>
