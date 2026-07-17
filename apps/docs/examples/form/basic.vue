<template>
  <xy-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <xy-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <xy-input v-model:value="formState.username" />
    </xy-form-item>

    <xy-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <xy-input-password v-model:value="formState.password" />
    </xy-form-item>

    <xy-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <xy-checkbox v-model:checked="formState.remember">Remember me</xy-checkbox>
    </xy-form-item>

    <xy-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <xy-button type="primary" html-type="submit">Submit</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>
