<template>
  <div>
    <a-button type="primary" @click="showModal">Modal</a-button>
    <a-button @click="confirm">Confirm</a-button>
    <a-modal v-model:open="open" title="Modal" ok-text="确认" cancel-text="取消" @ok="hideModal">
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
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
