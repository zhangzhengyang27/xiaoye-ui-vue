<template>
  <xy-form ref="formRef" :model="formState" name="dynamic_rule" v-bind="formItemLayout">
    <xy-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <xy-input v-model:value="formState.username" />
    </xy-form-item>

    <xy-form-item
      label="Nickname"
      name="nickname"
      :rules="[{ required: formState.checkNick, message: 'Please input your nickname!' }]"
    >
      <xy-input v-model:value="formState.nickname" />
    </xy-form-item>

    <xy-form-item name="checkNick" v-bind="formTailLayout">
      <xy-checkbox v-model:checked="formState.checkNick">Nickname is required</xy-checkbox>
    </xy-form-item>

    <xy-form-item v-bind="formTailLayout">
      <xy-button type="primary" @click="onCheck">Check</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import type { FormInstance } from 'xiaoye-ui';

interface FormState {
  username: string;
  nickname: string;
  checkNick: boolean;
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  username: '',
  nickname: '',
  checkNick: false,
});
watch(
  () => formState.checkNick,
  () => {
    formRef.value.validateFields(['nickname']);
  },
  { flush: 'post' },
);
const onCheck = async () => {
  try {
    const values = await formRef.value.validateFields();
    console.log('Success:', values);
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
};
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
</script>
