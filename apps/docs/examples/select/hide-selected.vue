<template>
  <a-select
    v-model:value="selectedItems"
    mode="multiple"
    placeholder="Inserted are removed"
    style="width: 100%"
    :options="filteredOptions.map(item => ({ value: item }))"
  ></a-select>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
const selectedItems = ref<string[]>([]);

const filteredOptions = computed(() => OPTIONS.filter(o => !selectedItems.value.includes(o)));
</script>
