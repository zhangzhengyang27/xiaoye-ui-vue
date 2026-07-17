<template>
  <xy-button type="primary" @click="openNotification">Open the notification box</xy-button>
</template>

<script lang="ts" setup>
import notification from 'xiaoye-ui/notification';
import { Button } from 'xiaoye-ui';
import { h } from 'vue';

const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};
const openNotification = () => {
  const key = `open${Date.now()}`;
  notification.open({
    message: 'Notification Title',
    description:
      'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
    btn: () =>
      h(
        Button,
        {
          type: 'primary',
          size: 'small',
          onClick: () => notification.close(key),
        },
        { default: () => 'Confirm' },
      ),
    key,
    onClose: close,
  });
};
</script>
