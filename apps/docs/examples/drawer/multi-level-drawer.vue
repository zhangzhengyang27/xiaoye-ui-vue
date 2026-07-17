<template>
  <xy-button type="primary" @click="showDrawer">Open</xy-button>
  <xy-drawer
    v-model:open="open"
    title="Multi-level drawer"
    width="520"
    :closable="false"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <xy-button type="primary" @click="showChildrenDrawer">Two-level drawer</xy-button>
    <xy-drawer v-model:open="childrenDrawer" title="Two-level Drawer" width="320" :closable="false">
      <xy-button type="primary" @click="showChildrenDrawer">This is two-level drawer</xy-button>
    </xy-drawer>

    <template #footer>
      <xy-button style="margin-right: 8px" @click="onClose">Cancel</xy-button>
      <xy-button type="primary" @click="onClose">Submit</xy-button>
    </template>
  </xy-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const open = ref<boolean>(false);

const childrenDrawer = ref<boolean>(false);

const showDrawer = () => {
  open.value = true;
};
const onClose = () => {
  open.value = false;
};
const showChildrenDrawer = () => {
  childrenDrawer.value = true;
};
</script>
