<template>
  <xy-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
    <xy-form-item label="Activity name">
      <xy-input v-model:value="formState.name" />
    </xy-form-item>
    <xy-form-item label="Instant delivery">
      <xy-switch v-model:checked="formState.delivery" />
    </xy-form-item>
    <xy-form-item label="Activity type">
      <xy-checkbox-group v-model:value="formState.type">
        <xy-checkbox value="1" name="type">Online</xy-checkbox>
        <xy-checkbox value="2" name="type">Promotion</xy-checkbox>
        <xy-checkbox value="3" name="type">Offline</xy-checkbox>
      </xy-checkbox-group>
    </xy-form-item>
    <xy-form-item label="Resources">
      <xy-radio-group v-model:value="formState.resource">
        <xy-radio value="1">Sponsor</xy-radio>
        <xy-radio value="2">Venue</xy-radio>
      </xy-radio-group>
    </xy-form-item>
    <xy-form-item label="Activity form">
      <xy-textarea v-model:value="formState.desc" />
    </xy-form-item>
    <xy-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <xy-button type="primary" @click="onSubmit">Create</xy-button>
      <xy-button style="margin-left: 10px">Cancel</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { reactive, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';

interface FormState {
  name: string;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
};
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
</script>
