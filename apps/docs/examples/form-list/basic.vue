<template>
  <xy-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
    <xy-form-list name="users">
      <template #default="{ fields, add, remove }">
        <xy-form-item
          v-for="(field, index) in fields"
          :key="field.key"
          :label="`用户 ${index + 1}`"
          :name="['users', index, 'name']"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <xy-input
            v-model:value="formState.users[index].name"
            placeholder="请输入用户名"
            style="width: 60%; margin-right: 8px"
          />
          <xy-button v-if="fields.length > 1" danger type="link" @click="remove(index)">
            删除
          </xy-button>
        </xy-form-item>

        <xy-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <xy-button type="dashed" @click="add({ name: '' })">
            <PlusOutlined />
            添加用户
          </xy-button>
        </xy-form-item>
      </template>
    </xy-form-list>
  </xy-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { PlusOutlined } from '@xiaoye-ui/icons';

const formState = reactive<{
  users: { name: string }[];
}>({
  users: [{ name: '张三' }],
});
</script>
