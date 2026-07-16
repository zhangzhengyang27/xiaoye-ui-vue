<template>
  <a-form name="customized_form_controls" layout="inline" :model="formState" @finish="onFinish">
    <a-form-item name="price" label="Price" :rules="[{ validator: checkPrice }]">
      <price-input v-model:value="formState.price" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
// sourceCode https://github.com/xiaoye-ui/xiaoye-ui/blob/cb3c002e17f0f4f5b3e8d01846069da0e2645aff/components/form/demo/price-input.vue
import PriceInput from './price-input.vue';
import type { Currency } from './price-input.vue';

const formState = reactive({
  price: {
    number: 0,
    currency: 'rmb' as Currency,
  },
});
const onFinish = (values: any) => {
  console.log('Received values from form: ', values);
};
const checkPrice = (_: any, value: { number: number }) => {
  if (value.number > 0) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('Price must be greater than zero!'));
};
</script>
