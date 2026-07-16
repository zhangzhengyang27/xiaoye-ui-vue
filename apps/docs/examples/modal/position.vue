<template>
  <div id="components-modal-demo-position">
    <a-button type="primary" @click="setModal1Visible(true)">
      Display a modal dialog at 20px to Top
    </a-button>
    <a-modal
      v-model:open="modal1Visible"
      title="20px to Top"
      style="top: 20px"
      @ok="setModal1Visible(false)"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
    <br />
    <br />
    <a-button type="primary" @click="modal2Visible = true">
      Vertically centered modal dialog
    </a-button>
    <a-modal
      v-model:open="modal2Visible"
      title="Vertically centered modal dialog"
      centered
      @ok="modal2Visible = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const modal1Visible = ref<boolean>(false);
const modal2Visible = ref<boolean>(false);

const setModal1Visible = (open: boolean) => {
  modal1Visible.value = open;
};
</script>
