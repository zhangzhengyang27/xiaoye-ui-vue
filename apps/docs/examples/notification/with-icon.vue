<template>
  <div>
    <xy-button @click="() => openNotificationWithIcon('success')">Success</xy-button>
    <xy-button @click="() => openNotificationWithIcon('info')">Info</xy-button>
    <xy-button @click="() => openNotificationWithIcon('warning')">Warning</xy-button>
    <xy-button @click="() => openNotificationWithIcon('error')">Error</xy-button>
  </div>
</template>
<script lang="ts" setup>
import notification from 'xiaoye-ui/notification';
const openNotificationWithIcon = (type: string) => {
  notification[type]({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  });
};
</script>
