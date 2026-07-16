<template>
  <div>
    <a-checkbox
      v-model:checked="state.checkAll"
      :indeterminate="state.indeterminate"
      @change="onCheckAllChange"
    >
      Check all
    </a-checkbox>
  </div>
  <a-divider />
  <a-checkbox-group v-model:value="state.checkedList" :options="plainOptions" />
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
const plainOptions = ['Apple', 'Pear', 'Orange'];
const state = reactive({
  indeterminate: true,
  checkAll: false,
  checkedList: ['Apple', 'Orange'],
});

const onCheckAllChange = (e: any) => {
  Object.assign(state, {
    checkedList: e.target.checked ? plainOptions : [],
    indeterminate: false,
  });
};
watch(
  () => state.checkedList,
  val => {
    state.indeterminate = !!val.length && val.length < plainOptions.length;
    state.checkAll = val.length === plainOptions.length;
  },
);
</script>
