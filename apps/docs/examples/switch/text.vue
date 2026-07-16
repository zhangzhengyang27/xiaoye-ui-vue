<template>
  <a-space direction="vertical">
    <a-switch v-model:checked="state.checked1" checked-children="开" un-checked-children="关" />
    <a-switch v-model:checked="state.checked2" checked-children="1" un-checked-children="0" />
    <a-switch v-model:checked="state.checked3">
      <template #checkedChildren><check-outlined /></template>
      <template #unCheckedChildren><close-outlined /></template>
    </a-switch>
  </a-space>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { CheckOutlined, CloseOutlined } from '@xiaoye-ui/icons';
const state = reactive({
  checked1: true,
  checked2: false,
  checked3: false,
});
</script>
