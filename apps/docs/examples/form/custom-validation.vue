<template>
  <xy-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
  >
    <xy-form-item has-feedback label="Password" name="pass">
      <xy-input v-model:value="formState.pass" type="password" autocomplete="off" />
    </xy-form-item>
    <xy-form-item has-feedback label="Confirm" name="checkPass">
      <xy-input v-model:value="formState.checkPass" type="password" autocomplete="off" />
    </xy-form-item>
    <xy-form-item has-feedback label="Age" name="age">
      <xy-input-number v-model:value="formState.age" />
    </xy-form-item>
    <xy-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <xy-button type="primary" html-type="submit">Submit</xy-button>
      <xy-button style="margin-left: 10px" @click="resetForm">Reset</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { Rule } from 'xiaoye-ui/form';
import type { FormInstance } from 'xiaoye-ui';
interface FormState {
  pass: string;
  checkPass: string;
  age: number | undefined;
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  pass: '',
  checkPass: '',
  age: undefined,
});
const checkAge = async (_rule: Rule, value: number) => {
  if (!value) {
    return Promise.reject('Please input the age');
  }
  if (!Number.isInteger(value)) {
    return Promise.reject('Please input digits');
  } else {
    if (value < 18) {
      return Promise.reject('Age must be greater than 18');
    } else {
      return Promise.resolve();
    }
  }
};
const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Please input the password');
  } else {
    if (formState.checkPass !== '') {
      formRef.value.validateFields('checkPass');
    }
    return Promise.resolve();
  }
};
const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('Please input the password again');
  } else if (value !== formState.pass) {
    return Promise.reject("Two inputs don't match!");
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  pass: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{ validator: validatePass2, trigger: 'change' }],
  age: [{ validator: checkAge, trigger: 'change' }],
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const handleFinish = (values: FormState) => {
  console.log(values, formState);
};
const handleFinishFailed = errors => {
  console.log(errors);
};
const resetForm = () => {
  formRef.value.resetFields();
};
const handleValidate = (...args) => {
  console.log(args);
};
</script>
