<template>
  <a-select
    v-model:value="state.value"
    mode="multiple"
    label-in-value
    placeholder="Select users"
    style="width: 100%"
    :filter-option="false"
    :not-found-content="state.fetching ? undefined : null"
    :options="state.data"
    @search="fetchUser"
  >
    <template v-if="state.fetching" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { debounce } from 'lodash-es';
let lastFetchId = 0;

const state = reactive({
  data: [],
  value: [],
  fetching: false,
});

const fetchUser = debounce(value => {
  console.log('fetching user', value);
  lastFetchId += 1;
  const fetchId = lastFetchId;
  state.data = [];
  state.fetching = true;
  fetch('https://randomuser.me/api/?results=5')
    .then(response => response.json())
    .then(body => {
      if (fetchId !== lastFetchId) {
        // for fetch callback order
        return;
      }
      const data = body.results.map(user => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }));
      state.data = data;
      state.fetching = false;
    });
}, 300);

watch(state.value, () => {
  state.data = [];
  state.fetching = false;
});
</script>
