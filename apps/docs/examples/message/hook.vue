<template>
  <context-holder />
  <xy-button type="primary" @click="info">Display normal message</xy-button>
</template>

<script lang="ts" setup>
import message from 'xiaoye-ui/message';
const [messageApi, contextHolder] = message.useMessage();

const info = () => {
  messageApi.info('Hello, Xiaoye UI!');
};
</script>
