<template>
  <xy-space direction="vertical">
    <xy-time-picker v-model:value="value" v-model:open="open" @openChange="handleOpenChange">
      <template #renderExtraFooter="{ prefixCls }">
        <xy-button size="small" type="primary" @click="handleClose">OK {{ prefixCls }}</xy-button>
      </template>
    </xy-time-picker>
    <xy-time-picker v-model:value="value" v-model:open="open2">
      <template #renderExtraFooter>
        <xy-button size="small" type="primary" @click="handleClose">OK</xy-button>
      </template>
    </xy-time-picker>
  </xy-space>
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
