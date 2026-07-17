<template>
  <div>
    <xy-button type="primary" @click="showModal">Modal</xy-button>
    <xy-button @click="confirm">Confirm</xy-button>
    <xy-modal v-model:open="open" title="Modal" ok-text="确认" cancel-text="取消" @ok="hideModal">
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </xy-modal>
  </div>
</template>
<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@xiaoye-ui/icons';
import { ref, createVNode } from 'vue';
import { Modal } from 'xiaoye-ui';
const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};
const hideModal = () => {
  open.value = false;
};

const confirm = () => {
  Modal.confirm({
    title: 'Confirm',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'Bla bla ...',
    okText: '确认',
    cancelText: '取消',
  });
};
</script>
