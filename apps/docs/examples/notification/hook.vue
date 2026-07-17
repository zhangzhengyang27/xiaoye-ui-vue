<template>
  <xy-space>
    <xy-button type="primary" @click="() => open('topLeft')">
      <RadiusUpleftOutlined />
      topLeft
    </xy-button>
    <xy-button type="primary" @click="() => open('topRight')">
      <RadiusUprightOutlined />
      topRight
    </xy-button>
  </xy-space>
  <xy-divider />
  <xy-space>
    <xy-button type="primary" @click="() => open('bottomLeft')">
      <RadiusBottomleftOutlined />
      bottomLeft
    </xy-button>
    <xy-button type="primary" @click="() => open('bottomRight')">
      <RadiusBottomrightOutlined />
      bottomRight
    </xy-button>
  </xy-space>
  <contextHolder />
</template>

<script lang="ts" setup>
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from '@xiaoye-ui/icons';
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
