<template>
  <xy-button-group>
    <xy-button @click="decline">
      <template #icon><MinusOutlined /></template>
      small
    </xy-button>
    <xy-button @click="increase">
      <template #icon><PlusOutlined /></template>
      large
    </xy-button>
  </xy-button-group>
  <br />
  <br />
  <xy-qrcode
    :size="size"
    :icon-size="size / 4"
    error-level="H"
    value="https://www.xiaoye-ui.github.io"
    icon="https://www.xiaoye-ui.github.io/assets/logo.1ef800a8.svg"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { MinusOutlined, PlusOutlined } from '@xiaoye-ui/icons';

const size = ref(160);
const decline = () => {
  size.value = size.value - 10;
  if (size.value < 48) {
    size.value = 48;
  }
};
const increase = () => {
  size.value = size.value + 10;
  if (size.value > 300) {
    size.value = 300;
  }
};
</script>
