<template>
  <div>
    <xy-slider :tip-formatter="formatter" />
    <xy-slider :tip-formatter="null" />
  </div>
</template>
<script lang="ts" setup>
const formatter = (value: number) => {
  return `${value}%`;
};
</script>
