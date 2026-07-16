<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal
      v-model:open="open"
      title="Basic Modal"
      width="100%"
      wrap-class-name="full-modal"
      @ok="handleOk"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};
</script>
<style lang="less">
.full-modal {
  .xy-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .xy-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .xy-modal-body {
    flex: 1;
  }
}
</style>
