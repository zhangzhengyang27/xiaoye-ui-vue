<template>
  <div>
    <Panel header="Header">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </Panel>
    <Button children="Show" @click="onShow" />
  </div>
</template>

<script setup>
import notification from 'xiaoye-ui/notification/notification';

const onShow = () => {
  notification.success({
    message: 'Success Message',
    description: 'Order submitted',
    duration: 3,
  });
};
</script>
