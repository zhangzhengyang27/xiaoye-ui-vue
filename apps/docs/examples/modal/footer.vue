<template>
  <div>
    <xy-button type="primary" @click="showModal">Open Modal with customized footer</xy-button>
    <xy-modal v-model:open="open" title="Title" @ok="handleOk">
      <template #footer>
        <xy-button key="back" @click="handleCancel">Return</xy-button>
        <xy-button key="submit" type="primary" :loading="loading" @click="handleOk">
          Submit
        </xy-button>
      </template>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </xy-modal>
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
