<template>
  <xy-radio-group v-model:value="placement" style="margin-right: 8px">
    <xy-radio value="top">top</xy-radio>
    <xy-radio value="right">right</xy-radio>
    <xy-radio value="bottom">bottom</xy-radio>
    <xy-radio value="left">left</xy-radio>
  </xy-radio-group>
  <xy-button type="primary" @click="showDrawer">Open</xy-button>
  <xy-drawer
    title="Basic Drawer"
    :placement="placement"
    :closable="false"
    :open="open"
    @close="onClose"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </xy-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { DrawerProps } from 'xiaoye-ui';
const placement = ref<DrawerProps['placement']>('left');
const open = ref<boolean>(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
</script>
