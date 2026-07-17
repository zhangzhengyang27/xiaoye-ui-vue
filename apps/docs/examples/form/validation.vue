<template>
  <xy-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <xy-form-item ref="name" label="Activity name" name="name">
      <xy-input v-model:value="formState.name" />
    </xy-form-item>
    <xy-form-item label="Activity zone" name="region">
      <xy-select v-model:value="formState.region" placeholder="please select your zone">
        <xy-select-option value="shanghai">Zone one</xy-select-option>
        <xy-select-option value="beijing">Zone two</xy-select-option>
      </xy-select>
    </xy-form-item>
    <xy-form-item label="Activity time" required name="date1">
      <xy-date-picker
        v-model:value="formState.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
      />
    </xy-form-item>
    <xy-form-item label="Instant delivery" name="delivery">
      <xy-switch v-model:checked="formState.delivery" />
    </xy-form-item>
    <xy-form-item label="Activity type" name="type">
      <xy-checkbox-group v-model:value="formState.type">
        <xy-checkbox value="1" name="type">Online</xy-checkbox>
        <xy-checkbox value="2" name="type">Promotion</xy-checkbox>
        <xy-checkbox value="3" name="type">Offline</xy-checkbox>
      </xy-checkbox-group>
    </xy-form-item>
    <xy-form-item label="Resources" name="resource">
      <xy-radio-group v-model:value="formState.resource">
        <xy-radio value="1">Sponsor</xy-radio>
        <xy-radio value="2">Venue</xy-radio>
      </xy-radio-group>
    </xy-form-item>
    <xy-form-item label="Activity form" name="desc">
      <xy-textarea v-model:value="formState.desc" />
    </xy-form-item>
    <xy-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <xy-button type="primary" @click="onSubmit">Create</xy-button>
      <xy-button style="margin-left: 10px" @click="resetForm">Reset</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { Dayjs } from 'dayjs';
import { reactive, ref, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';
import type { Rule } from 'xiaoye-ui/form';

interface FormState {
  name: string;
  region: string | undefined;
  date1: Dayjs | undefined;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}
const formRef = ref();
const labelCol = { span: 5 };
const wrapperCol = { span: 13 };
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  region: undefined,
  date1: undefined,
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'change' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
  date1: [{ required: true, message: 'Please pick a date', trigger: 'change', type: 'object' }],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log('values', formState, toRaw(formState));
    })
    .catch(error => {
      console.log('error', error);
    });
};
const resetForm = () => {
  formRef.value.resetFields();
};
</script>
