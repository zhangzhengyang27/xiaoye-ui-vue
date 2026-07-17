<template>
  <xy-space direction="vertical">
    <xy-input-number v-model:value="value1" addon-before="+" addon-after="$"></xy-input-number>
    <xy-input-number v-model:value="value2">
      <template #addonBefore>
        <xy-select v-model:value="addonBeforeValue" style="width: 60px">
          <xy-select-option value="add">+</xy-select-option>
          <xy-select-option value="minus">-</xy-select-option>
        </xy-select>
      </template>
      <template #addonAfter>
        <xy-select v-model:value="addonAfterValue" style="width: 60px">
          <xy-select-option value="USD">$</xy-select-option>
          <xy-select-option value="EUR">€</xy-select-option>
          <xy-select-option value="GBP">£</xy-select-option>
          <xy-select-option value="CNY">¥</xy-select-option>
        </xy-select>
      </template>
    </xy-input-number>
    <xy-input-number v-model:value="value3">
      <template #addonAfter><SettingOutlined /></template>
    </xy-input-number>
    <xy-input-number v-model:value="value4">
      <template #addonAfter>
        <xy-cascader placeholder="cascader" style="width: 150px" />
      </template>
    </xy-input-number>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { SettingOutlined } from '@xiaoye-ui/icons';
const value1 = ref(100);
const value2 = ref(100);
const value3 = ref(100);
const value4 = ref(100);
const addonBeforeValue = ref('add');
const addonAfterValue = ref('USD');
</script>
