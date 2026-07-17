<template>
  <xy-button type="primary" @click="info">Display normal message</xy-button>
</template>
<script lang="ts" setup>
import message from 'xiaoye-ui/message';
const info = () => {
  message.info('This is a normal message');
};
</script>
