<template>
  <xy-radio-group v-model:value="size">
    <xy-radio-button value="large">Large</xy-radio-button>
    <xy-radio-button value="middle">Middle</xy-radio-button>
    <xy-radio-button value="small">Small</xy-radio-button>
  </xy-radio-group>
  <br />
  <br />
  <xy-space direction="vertical">
    <xy-select
      v-model:value="value1"
      :size="size"
      style="width: 200px"
      :options="options"
    ></xy-select>
    <xy-select
      v-model:value="value2"
      :options="options"
      mode="multiple"
      :size="size"
      placeholder="Please select"
      style="width: 200px"
      @popupScroll="popupScroll"
    ></xy-select>
    <xy-select
      v-model:value="value3"
      :options="options"
      mode="tags"
      :size="size"
      placeholder="Please select"
      style="width: 200px"
    ></xy-select>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { SelectProps } from 'xiaoye-ui';
const popupScroll = () => {
  console.log('popupScroll');
};
const size = ref<SelectProps['size']>('middle');
const value1 = ref('a1');
const value2 = ref(['a1', 'b2']);
const value3 = ref(['a1', 'b2']);
const options = [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }));
</script>
