<template>
  <xy-button @click="success">Customized display duration</xy-button>
</template>
<script lang="ts" setup>
import message from 'xiaoye-ui/message';
const success = () => {
  message.success('This is a prompt message for success, and it will disappear in 10 seconds', 10);
};
</script>
