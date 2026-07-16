<template>
  <a-select
    v-model:value="value"
    show-search
    placeholder="input search text"
    style="width: 200px"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="null"
    :options="data"
    @search="handleSearch"
    @change="handleChange"
  ></a-select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

let timeout: ReturnType<typeof setTimeout>;
let currentValue = '';

function fetchData(searchValue: string, callback: (data: any[]) => void) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = searchValue;

  function fake() {
    fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`)
      .then(response => response.json())
      .then(d => {
        if (currentValue === searchValue) {
          const result = d.items || [];
          const resultData: any[] = result.map((r: any) => ({
            value: r.full_name,
            label: r.full_name,
          }));
          callback(resultData);
        }
      });
  }

  timeout = setTimeout(fake, 300);
}

const data = ref<any[]>([]);
const value = ref<string>();

const handleSearch = (val: string) => {
  fetchData(val, d => (data.value = d));
};
const handleChange = (val: string) => {
  console.log(val);
  value.value = val;
  fetchData(val, d => (data.value = d));
};
</script>
