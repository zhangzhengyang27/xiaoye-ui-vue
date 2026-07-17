<template>
  <xy-form :layout="formState.layout" :model="formState" v-bind="formItemLayout">
    <xy-form-item label="Form Layout">
      <xy-radio-group v-model:value="formState.layout">
        <xy-radio-button value="horizontal">Horizontal</xy-radio-button>
        <xy-radio-button value="vertical">Vertical</xy-radio-button>
        <xy-radio-button value="inline">Inline</xy-radio-button>
      </xy-radio-group>
    </xy-form-item>
    <xy-form-item label="Field A">
      <xy-input v-model:value="formState.fieldA" placeholder="input placeholder" />
    </xy-form-item>
    <xy-form-item label="Field B">
      <xy-input v-model:value="formState.fieldB" placeholder="input placeholder" />
    </xy-form-item>
    <xy-form-item :wrapper-col="buttonItemLayout.wrapperCol">
      <xy-button type="primary">Submit</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import type { UnwrapRef } from 'vue';

interface FormState {
  layout: 'horizontal' | 'vertical' | 'inline';
  fieldA: string;
  fieldB: string;
}
const formState: UnwrapRef<FormState> = reactive({
  layout: 'horizontal',
  fieldA: '',
  fieldB: '',
});
const formItemLayout = computed(() => {
  const { layout } = formState;
  return layout === 'horizontal'
    ? {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      }
    : {};
});
const buttonItemLayout = computed(() => {
  const { layout } = formState;
  return layout === 'horizontal'
    ? {
        wrapperCol: { span: 14, offset: 4 },
      }
    : {};
});
</script>
