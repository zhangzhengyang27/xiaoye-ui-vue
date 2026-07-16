<template>
  <a-auto-complete
    v-model:value="value"
    style="width: 200px"
    placeholder="input here"
    :options="options"
    @search="handleSearch"
  >
    <template #option="{ value: val }">
      {{ val.split('@')[0] }} @
      <span style="font-weight: bold">{{ val.split('@')[1] }}</span>
    </template>
  </a-auto-complete>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const value = ref('');
const options = ref<{ value: string }[]>([]);
const handleSearch = (val: string) => {
  let res: { value: string }[];
  if (!val || val.indexOf('@') >= 0) {
    res = [];
  } else {
    res = ['gmail.com', '163.com', 'qq.com'].map(domain => ({ value: `${val}@${domain}` }));
  }
  options.value = res;
};
</script>
