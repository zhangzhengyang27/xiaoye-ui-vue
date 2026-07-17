<template>
  <xy-radio-group v-model:value="placement">
    <xy-radio-button value="topLeft">topLeft</xy-radio-button>
    <xy-radio-button value="topRight">topRight</xy-radio-button>
    <xy-radio-button value="bottomLeft">bottomLeft</xy-radio-button>
    <xy-radio-button value="bottomRight">bottomRight</xy-radio-button>
  </xy-radio-group>
  <br />
  <br />
  <xy-space direction="vertical" :size="12">
    <xy-date-picker v-model:value="value1" :placement="placement" />
    <xy-range-picker v-model:value="value2" :placement="placement" />
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
const placement = ref('topLeft' as const);
const value1 = ref<Dayjs>();
const value2 = ref<[Dayjs, Dayjs]>();
</script>
