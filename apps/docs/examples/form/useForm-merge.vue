<template>
  <xy-form :label-col="labelCol" :wrapper-col="wrapperCol">
    <xy-form-item label="Activity name" required>
      <xy-input v-model:value="modelRef.name" />
    </xy-form-item>
    <xy-form-item label="Activity zone" required>
      <xy-select v-model:value="modelRef.region" placeholder="please select your zone">
        <xy-select-option value="shanghai">Zone one</xy-select-option>
        <xy-select-option value="beijing">Zone two</xy-select-option>
      </xy-select>
    </xy-form-item>
    <xy-form-item label="Activity type" required>
      <xy-checkbox-group v-model:value="modelRef.type">
        <xy-checkbox value="1" name="type">Online</xy-checkbox>
        <xy-checkbox value="2" name="type">Promotion</xy-checkbox>
        <xy-checkbox value="3" name="type">Offline</xy-checkbox>
      </xy-checkbox-group>
    </xy-form-item>
    <xy-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos">
      <xy-button type="primary" @click.prevent="onSubmit">Create</xy-button>
      <xy-button style="margin-left: 10px" @click="resetFields">Reset</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { reactive, toRaw, computed } from 'vue';
import { toArray } from 'lodash-es';
import { Form } from 'xiaoye-ui';

const useForm = Form.useForm;

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
const modelRef = reactive({
  name: '',
  region: undefined,
  type: [],
});
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: 'Please input name',
    },
  ],
  region: [
    {
      required: true,
      message: 'Please select region',
    },
  ],
  type: [
    {
      required: true,
      message: 'Please select type',
      type: 'array',
    },
  ],
});
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(modelRef, rulesRef);
const onSubmit = () => {
  validate()
    .then(() => {
      console.log(toRaw(modelRef));
    })
    .catch(err => {
      console.log('error', err);
    });
};
const errorInfos = computed(() => {
  return mergeValidateInfo(toArray(validateInfos));
});
</script>
<style scoped>
.error-infos :deep(.xy-form-explain) {
  white-space: pre-line;
}
</style>
