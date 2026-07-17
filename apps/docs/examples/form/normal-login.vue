<template>
  <xy-form
    :model="formState"
    name="normal_login"
    class="login-form"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <xy-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <xy-input v-model:value="formState.username">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </xy-input>
    </xy-form-item>

    <xy-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <xy-input-password v-model:value="formState.password">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </xy-input-password>
    </xy-form-item>

    <xy-form-item>
      <xy-form-item name="remember" no-style>
        <xy-checkbox v-model:checked="formState.remember">Remember me</xy-checkbox>
      </xy-form-item>
      <a class="login-form-forgot" href="">Forgot password</a>
    </xy-form-item>

    <xy-form-item>
      <xy-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
        Log in
      </xy-button>
      Or
      <a href="">register now!</a>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@xiaoye-ui/icons';
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
const disabled = computed(() => {
  return !(formState.username && formState.password);
});
</script>
<style scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
