<template>
  <context-holder />
  <a-button type="primary" @click="info">Display normal message</a-button>
</template>

<script lang="ts" setup>
import message from 'xiaoye-ui/message';
const [messageApi, contextHolder] = message.useMessage();

const info = () => {
  messageApi.info('Hello, Xiaoye UI!');
};
</script>
