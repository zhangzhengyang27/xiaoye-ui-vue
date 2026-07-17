<template>
  <xy-button type="primary" @click="openNotification">Open the notification box</xy-button>
</template>
<script lang="ts" setup>
import { SmileOutlined } from '@xiaoye-ui/icons';
import notification from 'xiaoye-ui/notification';
import { h } from 'vue';

const openNotification = () => {
  notification.open({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    icon: () => h(SmileOutlined, { style: 'color: #108ee9' }),
  });
};
</script>
