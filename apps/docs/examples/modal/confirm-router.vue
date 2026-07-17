<template>
  <xy-button @click="showConfirm">Confirm</xy-button>
</template>
<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@xiaoye-ui/icons';
import { createVNode } from 'vue';
import { Modal } from 'xiaoye-ui';
const showConfirm = () => {
  for (let i = 0; i < 3; i += 1) {
    setTimeout(() => {
      Modal.confirm({
        content: 'destroy all',
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log('Oops errors!'));
        },
        cancelText: 'Click to destroy all',
        onCancel() {
          Modal.destroyAll();
        },
      });
    }, i * 500);
  }
};
</script>
