<template>
  <xy-space direction="vertical">
    <xy-switch v-model:checked="checked" :disabled="disabled" />
    <xy-button type="primary" @click="onToggle">Toggle disabled</xy-button>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const checked = ref<boolean>(true);
const disabled = ref<boolean>(true);

const onToggle = () => {
  disabled.value = !disabled.value;
};
</script>
