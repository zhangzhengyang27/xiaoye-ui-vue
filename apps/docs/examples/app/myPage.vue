<template>
  <xy-space>
    <xy-button type="primary" @click="showMessage">Open message</xy-button>
    <xy-button type="primary" @click="showModal">Open modal</xy-button>
    <xy-button type="primary" @click="showNotification">Open notification</xy-button>
  </xy-space>
</template>

<script setup lang="ts">
import { App } from 'xiaoye-ui';

const { message, modal, notification } = App.useApp();

const showMessage = () => {
  message.success('Success!');
};

const showModal = () => {
  modal.warning({
    title: 'This is a warning message',
    content: 'some messages...some messages...',
  });
};

const showNotification = () => {
  notification.info({
    message: `Notification topLeft`,
    description: 'Hello, Xiaoye UI!!',
    placement: 'topLeft',
  });
};
</script>
