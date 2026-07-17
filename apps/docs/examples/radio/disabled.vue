<template>
  <div>
    <xy-radio v-model:checked="checked1" :disabled="disabled">Disabled</xy-radio>
    <xy-radio v-model:checked="checked2" :disabled="disabled">Disabled</xy-radio>
    <br />
    <div style="margin-top: 16px">
      <xy-button type="primary" @click="toggleDisabled">Toggle disabled</xy-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const disabled = ref<boolean>(true);
const checked1 = ref<boolean>(true);
const checked2 = ref<boolean>(false);

const toggleDisabled = () => {
  disabled.value = !disabled.value;
};
</script>
