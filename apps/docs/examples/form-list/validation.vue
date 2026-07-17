<template>
  <xy-form ref="formRef" :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
    <xy-form-list name="emails">
      <template #default="{ fields, add, remove }">
        <xy-form-item
          v-for="(field, index) in fields"
          :key="field.key"
          :label="`邮箱 ${index + 1}`"
          :name="['emails', index, 'value']"
          :rules="[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '邮箱格式不正确' },
          ]"
        >
          <xy-input
            v-model:value="formState.emails[index].value"
            placeholder="example@domain.com"
            style="width: 60%; margin-right: 8px"
          />
          <xy-button v-if="fields.length > 1" danger type="link" @click="remove(index)">
            删除
          </xy-button>
        </xy-form-item>

        <xy-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <xy-button type="dashed" @click="add({ value: '' })">
            <PlusOutlined />
            添加邮箱
          </xy-button>
        </xy-form-item>
      </template>
    </xy-form-list>

    <xy-form-item :wrapper-col="{ offset: 6, span: 16 }">
      <xy-space>
        <xy-button type="primary" @click="submit">提交校验</xy-button>
        <xy-button @click="reset">重置</xy-button>
      </xy-space>
    </xy-form-item>

    <xy-form-item v-if="result" :wrapper-col="{ offset: 6, span: 16 }">
      <pre class="demo-output">{{ result }}</pre>
    </xy-form-item>
  </xy-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { PlusOutlined } from '@xiaoye-ui/icons';
import type { FormInstance } from 'xiaoye-ui';

const formRef = ref<FormInstance>();
const result = ref('');

const formState = reactive<{
  emails: { value: string }[];
}>({
  emails: [{ value: '' }, { value: '' }],
});

const submit = () => {
  formRef.value
    ?.validate()
    .then(values => {
      result.value = `校验通过：\n${JSON.stringify(values, null, 2)}`;
    })
    .catch(error => {
      result.value = `校验失败：\n${JSON.stringify(error.errorFields, null, 2)}`;
    });
};

const reset = () => {
  formRef.value?.resetFields();
  result.value = '';
};
</script>

<style scoped>
.demo-output {
  margin: 0;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  font-size: 12px;
  color: #555;
  font-family: 'SFMono-Regular', Consolas, monospace;
  max-height: 200px;
  overflow: auto;
}
</style>
