<template>
  <xy-space direction="vertical">
    <xy-toggle-button disabled :value="true" />
    <xy-toggle-button :value="'day'" disabled :options="options" />
    <xy-toggle-button :value="['vue']" disabled multiple :options="options" />
  </xy-space>
</template>
<script lang="ts" setup>
// 禁用状态：整个按钮或单个选项均可设置为不可交互。
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular', disabled: true },
];
</script>
