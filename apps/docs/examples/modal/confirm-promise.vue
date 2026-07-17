<template>
  <xy-button @click="showConfirm">Confirm</xy-button>
</template>
<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@xiaoye-ui/icons';
import { createVNode } from 'vue';
import { Modal } from 'xiaoye-ui';
const showConfirm = () => {
  Modal.confirm({
    title: 'Do you want to delete these items?',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'When clicked the OK button, this dialog will be closed after 1 second',
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      }).catch(() => console.log('Oops errors!'));
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCancel() {},
  });
};
</script>
