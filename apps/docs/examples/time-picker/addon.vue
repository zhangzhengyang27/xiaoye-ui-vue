<template>
  <a-space direction="vertical">
    <a-time-picker v-model:value="value" v-model:open="open" @openChange="handleOpenChange">
      <template #renderExtraFooter="{ prefixCls }">
        <a-button size="small" type="primary" @click="handleClose">OK {{ prefixCls }}</a-button>
      </template>
    </a-time-picker>
    <a-time-picker v-model:value="value" v-model:open="open2">
      <template #renderExtraFooter>
        <a-button size="small" type="primary" @click="handleClose">OK</a-button>
      </template>
    </a-time-picker>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Dayjs } from 'dayjs';
const open = ref(false);
const open2 = ref(false);
const value = ref<Dayjs>();

const handleOpenChange = (openStatus: boolean) => {
  console.log('open', openStatus);
  open.value = openStatus;
};

const handleClose = () => {
  open.value = false;
  open2.value = false;
};
</script>
