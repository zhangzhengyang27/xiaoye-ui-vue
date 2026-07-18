<!-- 在表单中使用：color-picker 作为表单字段，配合 name 与 rules 校验，提交后获取颜色值 -->
<template>
  <xy-form
    :model="formState"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 14 }"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <xy-form-item
      label="主题名称"
      name="name"
      :rules="[{ required: true, message: '请输入主题名称' }]"
    >
      <xy-input v-model:value="formState.name" placeholder="请输入主题名称" />
    </xy-form-item>

    <xy-form-item
      label="主题色"
      name="color"
      :rules="[{ required: true, message: '请选择主题色' }]"
    >
      <xy-color-picker v-model="formState.color" :default-color="defaultColor" />
    </xy-form-item>

    <xy-form-item :wrapper-col="{ offset: 6, span: 14 }">
      <xy-button type="primary" html-type="submit">保存主题</xy-button>
    </xy-form-item>
  </xy-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { message } from 'xiaoye-ui';

const defaultColor = ref('1890ff');

const formState = reactive<{
  name: string;
  color: string | object | null;
}>({
  name: '',
  // 初始为 null，触发 required 校验
  color: null,
});

const onFinish = (values: any) => {
  message.success('主题已保存');
  console.warn('表单值：', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.warn('校验失败：', errorInfo);
};
</script>
