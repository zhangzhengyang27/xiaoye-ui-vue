<template>
  <xy-button type="primary" @click="openNotification">Open the notification box</xy-button>
</template>
<script lang="ts" setup>
import notification from 'xiaoye-ui/notification';
const openNotification = () => {
  notification.open({
    message: 'Notification Title',
    description:
      'I will never close automatically. I will be close automatically. I will never close automatically.',
    duration: 0,
  });
};
</script>
