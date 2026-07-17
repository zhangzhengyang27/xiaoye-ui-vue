<template>
  <xy-flex gap="middle" align="start" vertical>
    <p>Select justify :</p>
    <xy-segmented v-model:value="justify" :options="justifyOptions" />
    <p>Select align :</p>
    <xy-segmented v-model:value="alignItems" :options="alignOptions" />
    <xy-flex :style="{ ...boxStyle }" :justify="justify" :align="alignItems">
      <xy-button type="primary">Primary</xy-button>
      <xy-button type="primary">Primary</xy-button>
      <xy-button type="primary">Primary</xy-button>
      <xy-button type="primary">Primary</xy-button>
    </xy-flex>
  </xy-flex>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { CSSProperties } from 'vue';
import type { FlexProps } from 'xiaoye-ui';
const justifyOptions = reactive<FlexProps['justify'][]>([
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
]);

const alignOptions = reactive<FlexProps['align'][]>(['flex-start', 'center', 'flex-end']);
const justify = ref(justifyOptions[0]);
const alignItems = ref(alignOptions[0]);
const boxStyle: CSSProperties = {
  width: '100%',
  height: '120px',
  borderRadius: '6px',
  border: '1px solid #40a9ff',
};
</script>
