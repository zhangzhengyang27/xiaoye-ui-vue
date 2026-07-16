<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal with customized footer</a-button>
    <a-modal v-model:open="open" title="Title" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel">Return</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
      </template>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const loading = ref<boolean>(false);
const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    open.value = false;
  }, 2000);
};

const handleCancel = () => {
  open.value = false;
};
</script>
