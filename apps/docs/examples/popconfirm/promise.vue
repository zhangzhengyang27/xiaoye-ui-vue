<template>
  <xy-popconfirm title="Title" @confirm="confirm" @cancel="cancel">
    <xy-button type="primary">Open Popconfirm with Promise</xy-button>
  </xy-popconfirm>
</template>
<script lang="ts" setup>
import message from 'xiaoye-ui/message';
const confirm = (e: MouseEvent) => {
  console.log(e);
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 3000);
  });
};

const cancel = (e: MouseEvent) => {
  console.log(e);
  message.error('Click on No');
};
</script>
