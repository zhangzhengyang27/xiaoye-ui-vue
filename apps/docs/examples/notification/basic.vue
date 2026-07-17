<template>
  <xy-button type="primary" @click="openNotification">Open the notification box</xy-button>
</template>
<script lang="ts" setup>
import notification from 'xiaoye-ui/notification';
const openNotification = () => {
  notification.open({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};
</script>
