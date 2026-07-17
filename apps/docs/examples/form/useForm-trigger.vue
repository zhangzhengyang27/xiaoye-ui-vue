<template>
  <xy-form :label-col="labelCol" :wrapper-col="wrapperCol">
    <xy-form-item label="Activity name" v-bind="validateInfos.name">
      <xy-input
        v-model:value="modelRef.name"
        @blur="validate('name', { trigger: 'blur' }).catch(() => {})"
      />
    </xy-form-item>
    <xy-form-item label="Activity zone" v-bind="validateInfos.region">
      <xy-select v-model:value="modelRef.region" placeholder="please select your zone">
        <xy-select-option value="shanghai">Zone one</xy-select-option>
        <xy-select-option value="beijing">Zone two</xy-select-option>
      </xy-select>
    </xy-form-item>
    <xy-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <xy-button type="primary" @click.prevent="onSubmit">Create</xy-button>
      <xy-button style="margin-left: 10px" @click="resetFields">Reset</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { reactive, toRaw } from 'vue';
import { Form } from 'xiaoye-ui';

const useForm = Form.useForm;

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
const modelRef = reactive({
  name: '',
  region: undefined,
});
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: 'Please input Activity name',
    },
    {
      min: 3,
      max: 5,
      message: 'Length should be 3 to 5',
      trigger: 'blur',
    },
  ],
  region: [
    {
      required: true,
      message: 'Please select region',
    },
  ],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
const onSubmit = () => {
  validate()
    .then(() => {
      console.log(toRaw(modelRef));
    })
    .catch(err => {
      console.log('error', err);
    });
};
</script>
