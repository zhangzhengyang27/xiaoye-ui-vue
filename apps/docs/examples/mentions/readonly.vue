<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-mentions
        v-model:value="value1"
        :options="options"
        placeholder="this is disabled Mentions"
        disabled
      ></a-mentions>
    </div>
    <a-mentions
      v-model:value="value2"
      :options="options"
      placeholder="this is readOnly a-mentions"
      readonly
    ></a-mentions>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref<string>('');
const value2 = ref<string>('');
const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];
</script>
