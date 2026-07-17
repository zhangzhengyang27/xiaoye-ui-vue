<template>
  <xy-radio-group v-model:value="placement">
    <xy-radio-button value="topLeft">topLeft</xy-radio-button>
    <xy-radio-button value="topRight">topRight</xy-radio-button>
    <xy-radio-button value="bottomLeft">bottomLeft</xy-radio-button>
    <xy-radio-button value="bottomRight">bottomRight</xy-radio-button>
  </xy-radio-group>
  <br />
  <br />
  <xy-select
    v-model:value="value"
    style="width: 120px"
    :dropdown-match-select-width="false"
    :placement="placement"
  >
    <xy-select-option value="HangZhou">HangZhou #310000</xy-select-option>
    <xy-select-option value="NingBo">NingBo #315000</xy-select-option>
    <xy-select-option value="WenZhou">WenZhou #325000</xy-select-option>
  </xy-select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const placement = ref('topLeft' as const);
const value = ref('HangZhou');
</script>
