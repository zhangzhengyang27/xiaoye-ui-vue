<template>
  <a-radio-group v-model:value="placement" style="margin-right: 8px">
    <a-radio value="top">top</a-radio>
    <a-radio value="right">right</a-radio>
    <a-radio value="bottom">bottom</a-radio>
    <a-radio value="left">left</a-radio>
  </a-radio-group>
  <a-button type="primary" @click="showDrawer">Open</a-button>
  <a-drawer
    title="Basic Drawer"
    :placement="placement"
    :closable="false"
    :open="open"
    @close="onClose"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
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
