<template>
  <xy-form
    :model="formState"
    v-bind="layout"
    name="nest-messages"
    :validate-messages="validateMessages"
    @finish="onFinish"
  >
    <xy-form-item :name="['user', 'name']" label="Name" :rules="[{ required: true }]">
      <xy-input v-model:value="formState.user.name" />
    </xy-form-item>
    <xy-form-item :name="['user', 'email']" label="Email" :rules="[{ type: 'email' }]">
      <xy-input v-model:value="formState.user.email" />
    </xy-form-item>
    <xy-form-item
      :name="['user', 'age']"
      label="Age"
      :rules="[{ type: 'number', min: 0, max: 99 }]"
    >
      <xy-input-number v-model:value="formState.user.age" />
    </xy-form-item>
    <xy-form-item :name="['user', 'website']" label="Website">
      <xy-input v-model:value="formState.user.website" />
    </xy-form-item>
    <xy-form-item :name="['user', 'introduction']" label="Introduction">
      <xy-textarea v-model:value="formState.user.introduction" />
    </xy-form-item>
    <xy-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
      <xy-button type="primary" html-type="submit">Submit</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const formState = reactive({
  user: {
    name: '',
    age: undefined,
    email: '',
    website: '',
    introduction: '',
  },
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};
</script>
