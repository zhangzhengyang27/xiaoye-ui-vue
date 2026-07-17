<template>
  <xy-space>
    <xy-button @click="success">Success</xy-button>
    <xy-button @click="error">Error</xy-button>
    <xy-button @click="warning">Warning</xy-button>
  </xy-space>
</template>
<script lang="ts" setup>
import message from 'xiaoye-ui/message';
const success = () => {
  message.success('This is a success message');
};
const error = () => {
  message.error('This is an error message');
};
const warning = () => {
  message.warning('This is a warning message');
};
</script>
