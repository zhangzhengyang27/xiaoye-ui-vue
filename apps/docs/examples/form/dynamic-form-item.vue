<template>
  <xy-form
    ref="formRef"
    name="dynamic_form_item"
    :model="dynamicValidateForm"
    v-bind="formItemLayoutWithOutLabel"
  >
    <xy-form-item
      v-for="(domain, index) in dynamicValidateForm.domains"
      :key="domain.key"
      v-bind="index === 0 ? formItemLayout : {}"
      :label="index === 0 ? 'Domains' : ''"
      :name="['domains', index, 'value']"
      :rules="{
        required: true,
        message: 'domain can not be null',
        trigger: 'change',
      }"
    >
      <xy-input
        v-model:value="domain.value"
        placeholder="please input domain"
        style="width: 60%; margin-right: 8px"
      />
      <MinusCircleOutlined
        v-if="dynamicValidateForm.domains.length > 1"
        class="dynamic-delete-button"
        @click="removeDomain(domain)"
      />
    </xy-form-item>
    <xy-form-item v-bind="formItemLayoutWithOutLabel">
      <xy-button type="dashed" style="width: 60%" @click="addDomain">
        <PlusOutlined />
        Add field
      </xy-button>
    </xy-form-item>
    <xy-form-item v-bind="formItemLayoutWithOutLabel">
      <xy-button type="primary" html-type="submit" @click="submitForm">Submit</xy-button>
      <xy-button style="margin-left: 10px" @click="resetForm">Reset</xy-button>
    </xy-form-item>
  </xy-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { MinusCircleOutlined, PlusOutlined } from '@xiaoye-ui/icons';
import type { FormInstance } from 'xiaoye-ui';

interface Domain {
  value: string;
  key: number;
}
const formRef = ref<FormInstance>();
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};
const dynamicValidateForm = reactive<{ domains: Domain[] }>({
  domains: [],
});
const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log('values', dynamicValidateForm.domains);
    })
    .catch(error => {
      console.log('error', error);
    });
};
const resetForm = () => {
  formRef.value.resetFields();
};
const removeDomain = (item: Domain) => {
  const index = dynamicValidateForm.domains.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.domains.splice(index, 1);
  }
};
const addDomain = () => {
  dynamicValidateForm.domains.push({
    value: '',
    key: Date.now(),
  });
};
</script>

<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
