<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal with async logic</a-button>
    <a-modal v-model:open="open" title="Title" :confirm-loading="confirmLoading" @ok="handleOk">
      <p>{{ modalText }}</p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const modalText = ref<string>('Content of the modal');
const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = () => {
  modalText.value = 'The modal will be closed after two seconds';
  confirmLoading.value = true;
  setTimeout(() => {
    open.value = false;
    confirmLoading.value = false;
  }, 2000);
};
</script>
