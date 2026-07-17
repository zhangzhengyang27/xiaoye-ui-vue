<template>
  <xy-space direction="vertical">
    <xy-input v-model:value="value1" addon-before="Http://" addon-after=".com" />
    <xy-input v-model:value="value2">
      <template #addonBefore>
        <xy-select v-model:value="value3" style="width: 90px">
          <xy-select-option value="Http://">Http://</xy-select-option>
          <xy-select-option value="Https://">Https://</xy-select-option>
        </xy-select>
      </template>
      <template #addonAfter>
        <xy-select v-model:value="value4" style="width: 80px">
          <xy-select-option value=".com">.com</xy-select-option>
          <xy-select-option value=".jp">.jp</xy-select-option>
          <xy-select-option value=".cn">.cn</xy-select-option>
          <xy-select-option value=".org">.org</xy-select-option>
        </xy-select>
      </template>
    </xy-input>
    <xy-input v-model:value="value5">
      <template #addonAfter>
        <setting-outlined />
      </template>
    </xy-input>

    <xy-input v-model:value="value6">
      <template #addonBefore>
        <xy-cascader placeholder="cascader" style="width: 150px" />
      </template>
    </xy-input>
  </xy-space>
</template>

<script lang="ts" setup>
import { SettingOutlined } from '@xiaoye-ui/icons';
import { ref } from 'vue';
const value1 = ref<string>('mysite');
const value2 = ref<string>('mysite');
const value3 = ref<string>('Http://');
const value4 = ref<string>('.com');
const value5 = ref<string>('mysite');
const value6 = ref<string>('mysite');
</script>
