<template>
  <xy-form ref="formRef" :model="formState" name="form_context" v-bind="layout" @finish="onFinish">
    <xy-form-item
      name="group"
      label="Group Name"
      :rules="[{ required: true, message: 'Please input group name!' }]"
    >
      <xy-input v-model:value="formState.group" />
    </xy-form-item>

    <xy-form-item label="User List">
      <template v-if="formState.users.length">
        <ul>
          <template v-for="user in formState.users" :key="user.key">
            <li class="user">
              <xy-avatar>
                <template #icon><UserOutlined /></template>
              </xy-avatar>
              {{ user.name }} - {{ user.age }}
            </li>
          </template>
        </ul>
      </template>
      <template v-else>
        <xy-typography-text class="xy-form-text" type="secondary">
          (
          <SmileOutlined />
          No user yet. )
        </xy-typography-text>
      </template>
    </xy-form-item>

    <xy-form-item v-bind="tailLayout">
      <xy-button html-type="submit" type="primary">Submit</xy-button>
      <xy-button html-type="button" style="margin: 0 8px" @click="visible = true">
        Add User
      </xy-button>
    </xy-form-item>
  </xy-form>
  <xy-modal v-model:open="visible" title="Basic Drawer" @ok="onOk">
    <xy-form ref="modalFormRef" :model="modalFormState" layout="vertical" name="userForm">
      <xy-form-item name="name" label="User Name" :rules="[{ required: true }]">
        <xy-input v-model:value="modalFormState.name" />
      </xy-form-item>
      <xy-form-item name="age" label="User Age" :rules="[{ required: true }]">
        <xy-input-number v-model:value="modalFormState.age" />
      </xy-form-item>
    </xy-form>
  </xy-modal>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, toRaw } from 'vue';
import type { FormInstance } from 'xiaoye-ui';
import { SmileOutlined, UserOutlined } from '@xiaoye-ui/icons';

interface UserType {
  name?: string;
  age?: number;
  key?: number;
}

interface FormState {
  group: string;
  users: UserType[];
}

const formRef = ref<FormInstance>();
const modalFormRef = ref<FormInstance>();
const visible = ref(false);
const formState = reactive<FormState>({
  group: '',
  users: [],
});
const modalFormState = ref<UserType>({});

watch(
  visible,
  () => {
    modalFormState.value = {};
  },
  { flush: 'post' },
);

const onOk = () => {
  modalFormRef.value.validateFields().then(() => {
    formState.users.push({ ...modalFormState.value, key: Date.now() });
    visible.value = false;
  });
};
const onFinish = () => {
  console.log('Finish:', toRaw(formState));
};
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
</script>
<style scoped>
#components-form-demo-form-context .user {
  margin-bottom: 8px;
}

#components-form-demo-form-context .user .xy-avatar {
  margin-right: 8px;
}

.xy-row-rtl #components-form-demo-form-context .user .xy-avatar {
  margin-right: 0;
  margin-left: 8px;
}
</style>
