<!-- 表单中使用：switch 作为表单字段，配合 rules 校验「同意协议」必填 -->
<template>
  <xy-form
    :model="formState"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 14 }"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <xy-form-item
      label="用户名"
      name="username"
      :rules="[{ required: true, message: '请输入用户名' }]"
    >
      <xy-input v-model:value="formState.username" placeholder="请输入用户名" />
    </xy-form-item>

    <xy-form-item label="邮件订阅" name="subscribe">
      <xy-switch
        v-model:checked="formState.subscribe"
        checked-children="开"
        un-checked-children="关"
      />
    </xy-form-item>

    <xy-form-item label="同意协议" name="agreement" :rules="[{ validator: validateAgreement }]">
      <xy-switch v-model:checked="formState.agreement" />
      <span class="demo-agreement-text">我已阅读并同意《服务协议》</span>
    </xy-form-item>

    <xy-form-item :wrapper-col="{ offset: 6, span: 14 }">
      <xy-button type="primary" html-type="submit">提交</xy-button>
    </xy-form-item>
  </xy-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { message } from 'xiaoye-ui';

const formState = reactive({
  username: '',
  subscribe: false,
  agreement: false,
});

// 同意协议必须为开启状态
const validateAgreement = (_: unknown, value: boolean) => {
  if (!value) {
    return Promise.reject(new Error('请先同意协议'));
  }
  return Promise.resolve();
};

const onFinish = (values: any) => {
  message.success('提交成功');
  console.warn('表单值：', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.warn('校验失败：', errorInfo);
};
</script>

<style scoped>
.demo-agreement-text {
  margin-left: 8px;
  font-size: 14px;
  color: #555;
}
</style>
