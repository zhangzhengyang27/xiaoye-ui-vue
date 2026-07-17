<template>
  <xy-button type="primary" style="margin-right: 8px" @click="showDrawer('default')">
    Open Default Size (378px)
  </xy-button>
  <xy-button type="primary" @click="showDrawer('large')">Open Large Size (736px)</xy-button>
  <xy-drawer title="Basic Drawer" :size="size" :open="open" @close="onClose">
    <template #extra>
      <xy-button style="margin-right: 8px" @click="onClose">Cancel</xy-button>
      <xy-button type="primary" @click="onClose">Submit</xy-button>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </xy-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { DrawerProps } from 'xiaoye-ui';
const open = ref<boolean>(false);
const size = ref<DrawerProps['size']>('default');

const showDrawer = (val: DrawerProps['size']) => {
  size.value = val;
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
</script>
