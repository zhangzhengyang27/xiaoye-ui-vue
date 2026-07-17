<template>
  <xy-space direction="vertical">
    <xy-space>
      <xy-button type="primary" loading>Loading</xy-button>
      <xy-button type="primary" size="small" loading>Loading</xy-button>
    </xy-space>
    <xy-space>
      <xy-button type="primary" :loading="loading" @mouseenter="loading = true">
        mouseenter me!
      </xy-button>
      <xy-button type="primary" :loading="iconLoading" @click="enterIconLoading">
        <template #icon><PoweroffOutlined /></template>
        延迟1s
      </xy-button>
    </xy-space>
    <xy-space>
      <xy-button type="primary" loading />
      <xy-button type="primary" shape="circle" loading />
      <xy-button danger shape="round" loading />
    </xy-space>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { PoweroffOutlined } from '@xiaoye-ui/icons';

interface DelayLoading {
  delay: number;
}
const loading = ref<boolean>(false);
const iconLoading = ref<boolean | DelayLoading>(false);
const enterIconLoading = () => {
  iconLoading.value = { delay: 1000 };

  setTimeout(() => {
    iconLoading.value = false;
  }, 6000);
};
</script>
