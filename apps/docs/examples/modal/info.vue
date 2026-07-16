<template>
  <a-space wrap>
    <a-button @click="info">Info</a-button>
    <a-button @click="success">Success</a-button>
    <a-button @click="error">Error</a-button>
    <a-button @click="warning">Warning</a-button>
  </a-space>
</template>
<script lang="ts" setup>
import { Modal } from 'xiaoye-ui';
import { h } from 'vue';
const info = () => {
  Modal.info({
    title: 'This is a notification message',
    content: h('div', {}, [
      h('p', 'some messages...some messages...'),
      h('p', 'some messages...some messages...'),
    ]),
    onOk() {
      console.log('ok');
    },
  });
};
const success = () => {
  Modal.success({
    title: 'This is a success message',
    content: h('div', {}, [
      h('p', 'some messages...some messages...'),
      h('p', 'some messages...some messages...'),
    ]),
  });
};

const error = () => {
  Modal.error({
    title: 'This is an error message',
    content: 'some messages...some messages...',
  });
};

const warning = () => {
  Modal.warning({
    title: 'This is a warning message',
    content: 'some messages...some messages...',
  });
};
</script>
