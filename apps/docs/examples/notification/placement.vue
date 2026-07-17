<template>
  <div>
    <xy-button type="primary" @click="openNotification('top')">
      <template #icon><BorderTopOutlined /></template>
      top
    </xy-button>
    <xy-button type="primary" @click="openNotification('bottom')">
      <template #icon><BorderBottomOutlined /></template>
      bottom
    </xy-button>
    <xy-button type="primary" @click="openNotification('topLeft')">
      <template #icon><radius-upleft-outlined /></template>
      topLeft
    </xy-button>
    <xy-button type="primary" @click="openNotification('topRight')">
      <template #icon><radius-upright-outlined /></template>
      topRight
    </xy-button>
    <xy-divider />
    <xy-button type="primary" @click="openNotification('bottomLeft')">
      <template #icon><radius-bottomleft-outlined /></template>
      bottomLeft
    </xy-button>
    <xy-button type="primary" @click="openNotification('bottomRight')">
      <template #icon><radius-bottomright-outlined /></template>
      bottomRight
    </xy-button>
  </div>
</template>
<script lang="ts" setup>
import {
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  BorderTopOutlined,
  BorderBottomOutlined,
} from '@xiaoye-ui/icons';
import notification from 'xiaoye-ui/notification';
import type { NotificationPlacement } from 'xiaoye-ui';
const openNotification = (placement: NotificationPlacement) => {
  notification.open({
    message: `Notification ${placement}`,
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    placement,
  });
};
</script>
