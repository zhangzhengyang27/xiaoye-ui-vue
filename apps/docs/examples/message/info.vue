<template>
  <a-button type="primary" @click="info">Display normal message</a-button>
</template>
<script lang="ts" setup>
import message from 'xiaoye-ui/message';
const info = () => {
  message.info('This is a normal message');
};
</script>
