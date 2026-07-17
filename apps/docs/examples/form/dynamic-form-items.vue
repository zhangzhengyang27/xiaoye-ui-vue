<template>
  <xy-form
    ref="formRef"
    name="dynamic_form_nest_item"
    :model="dynamicValidateForm"
    @finish="onFinish"
  >
    <xy-space
      v-for="(user, index) in dynamicValidateForm.users"
      :key="user.id"
      style="display: flex; margin-bottom: 8px"
      align="baseline"
    >
      <xy-form-item
        :name="['users', index, 'first']"
        :rules="{
          required: true,
          message: 'Missing first name',
        }"
      >
        <xy-input v-model:value="user.first" placeholder="First Name" />
      </xy-form-item>
      <xy-form-item
        :name="['users', index, 'last']"
        :rules="{
          required: true,
          message: 'Missing last name',
        }"
      >
        <xy-input v-model:value="user.last" placeholder="Last Name" />
      </xy-form-item>
      <MinusCircleOutlined @click="removeUser(user)" />
    </xy-space>
    <xy-form-item>
      <xy-button type="dashed" block @click="addUser">
        <PlusOutlined />
        Add user
      </xy-button>
    </xy-form-item>
    <xy-form-item>
      <xy-button type="primary" html-type="submit">Submit</xy-button>
    </xy-form-item>
  </xy-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { MinusCircleOutlined, PlusOutlined } from '@xiaoye-ui/icons';
import type { FormInstance } from 'xiaoye-ui';

interface User {
  first: string;
  last: string;
  id: number;
}
const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{ users: User[] }>({
  users: [],
});
const removeUser = (item: User) => {
  const index = dynamicValidateForm.users.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.users.splice(index, 1);
  }
};
const addUser = () => {
  dynamicValidateForm.users.push({
    first: '',
    last: '',
    id: Date.now(),
  });
};
const onFinish = values => {
  console.log('Received values of form:', values);
  console.log('dynamicValidateForm.users:', dynamicValidateForm.users);
};
</script>
