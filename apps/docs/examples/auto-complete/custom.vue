<template>
  <xy-auto-complete
    v-model:value="value"
    :options="options"
    style="width: 200px"
    @search="handleSearch"
    @select="onSelect"
  >
    <xy-textarea
      placeholder="input here"
      class="custom"
      style="height: 50px"
      @keypress="handleKeyPress"
    />
  </xy-auto-complete>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const value = ref('');
const options = ref<{ value: string }[]>([]);
const onSelect = (value: string) => {
  console.log('onSelect', value);
};
const handleSearch = (value: string) => {
  options.value = !value
    ? []
    : [{ value }, { value: value + value }, { value: value + value + value }];
};
const handleKeyPress = (ev: KeyboardEvent) => {
  console.log('handleKeyPress', ev);
};
</script>
