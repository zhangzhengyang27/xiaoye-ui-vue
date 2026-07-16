<template>
  <a-button type="primary" @click="openNotification">Open the notification box</a-button>
</template>
<script>
import notification from 'xiaoye-ui/notification';
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const openNotification = () => {
      notification.open({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        style: {
          width: '600px',
          marginLeft: `${335 - 600}px`,
        },
        class: 'notification-custom-class',
      });
    };
    return {
      openNotification,
    };
  },
});
</script>
<style scoped>
.notification-custom-class {
  color: red;
}
</style>
