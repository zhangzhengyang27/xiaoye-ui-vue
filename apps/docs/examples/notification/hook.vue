<template>
  <a-space>
    <a-button type="primary" @click="() => open('topLeft')">
      <RadiusUpleftOutlined />
      topLeft
    </a-button>
    <a-button type="primary" @click="() => open('topRight')">
      <RadiusUprightOutlined />
      topRight
    </a-button>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="() => open('bottomLeft')">
      <RadiusBottomleftOutlined />
      bottomLeft
    </a-button>
    <a-button type="primary" @click="() => open('bottomRight')">
      <RadiusBottomrightOutlined />
      bottomRight
    </a-button>
  </a-space>
  <contextHolder />
</template>

<script lang="ts" setup>
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from '@ant-design/icons-vue';
import notification from 'xiaoye-ui/notification';
import { NotificationPlacement } from 'xiaoye-ui';
const [api, contextHolder] = notification.useNotification();
const open = (placement: NotificationPlacement) => openNotification(placement);
const openNotification = (placement: NotificationPlacement) => {
  api.info({
    message: `Notification ${placement}`,
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    placement,
  });
};
</script>
