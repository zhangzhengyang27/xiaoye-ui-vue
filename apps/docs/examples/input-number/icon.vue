<template>
  <div>
    <xy-input-number id="inputNumber" v-model:value="value" :min="1" :max="10">
      <template #upIcon>
        <ArrowUpOutlined />
      </template>
      <template #downIcon>
        <ArrowDownOutlined />
      </template>
    </xy-input-number>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { ArrowUpOutlined, ArrowDownOutlined } from '@xiaoye-ui/icons';
const value = ref<number>(3);
</script>
