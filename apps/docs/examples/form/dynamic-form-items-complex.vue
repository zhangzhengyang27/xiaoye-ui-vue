<template>
  <xy-form
    ref="formRef"
    name="dynamic_form_nest_item"
    :model="dynamicValidateForm"
    @finish="onFinish"
  >
    <xy-form-item name="area" label="Area" :rules="[{ required: true, message: 'Missing area' }]">
      <xy-select v-model:value="dynamicValidateForm.area" :options="areas" />
    </xy-form-item>
    <xy-space
      v-for="(sight, index) in dynamicValidateForm.sights"
      :key="sight.id"
      style="display: flex; margin-bottom: 8px"
      align="baseline"
    >
      <xy-form-item
        :name="['sights', index, 'value']"
        label="Sight"
        :rules="{
          required: true,
          message: 'Missing sight',
        }"
      >
        <xy-select
          v-model:value="sight.value"
          :disabled="!dynamicValidateForm.area"
          :options="(sights[dynamicValidateForm.area] || []).map(a => ({ value: a }))"
          style="width: 130px"
        ></xy-select>
      </xy-form-item>
      <xy-form-item
        label="Price"
        :name="['sights', index, 'price']"
        :rules="{
          required: true,
          message: 'Missing price',
        }"
      >
        <xy-input v-model:value="sight.price" />
      </xy-form-item>
      <MinusCircleOutlined @click="removeSight(sight)" />
    </xy-space>
    <xy-form-item>
      <xy-button type="dashed" block @click="addSight">
        <PlusOutlined />
        Add sights
      </xy-button>
    </xy-form-item>
    <xy-form-item>
      <xy-button type="primary" html-type="submit">Submit</xy-button>
    </xy-form-item>
  </xy-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { MinusCircleOutlined, PlusOutlined } from '@xiaoye-ui/icons';
import type { FormInstance } from 'xiaoye-ui';

interface Sights {
  value: string;
  price: string;
  id: number;
}
const areas = [
  { label: 'Beijing', value: 'Beijing' },
  { label: 'Shanghai', value: 'Shanghai' },
];

const sights = {
  Beijing: ['Tiananmen', 'Great Wall'],
  Shanghai: ['Oriental Pearl', 'The Bund'],
};

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{ sights: Sights[]; area: string }>({
  sights: [],
  area: undefined,
});
watch(
  () => dynamicValidateForm.area,
  () => {
    dynamicValidateForm.sights = [];
  },
);
const removeSight = (item: Sights) => {
  const index = dynamicValidateForm.sights.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.sights.splice(index, 1);
  }
};
const addSight = () => {
  dynamicValidateForm.sights.push({
    value: undefined,
    price: undefined,
    id: Date.now(),
  });
};
const onFinish = values => {
  console.log('Received values of form:', values);
  console.log('dynamicValidateForm:', dynamicValidateForm);
};
</script>
