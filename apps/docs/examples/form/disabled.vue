<template>
  <xy-checkbox :checked="componentDisabled" @change="e => (componentDisabled = e.target.checked)">
    Form disabled
  </xy-checkbox>
  <xy-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    layout="horizontal"
    :disabled="componentDisabled"
    style="max-width: 600px"
  >
    <xy-form-item label="Checkbox">
      <xy-checkbox>checkbox</xy-checkbox>
    </xy-form-item>
    <xy-form-item label="Radio">
      <xy-radio-group v-model:value="radioValue">
        <xy-radio value="apple">Apple</xy-radio>
        <xy-radio value="pear">Pear</xy-radio>
      </xy-radio-group>
    </xy-form-item>
    <xy-form-item label="Input">
      <xy-input />
    </xy-form-item>
    <xy-form-item label="Select">
      <xy-select>
        <xy-select-option value="demo">Demo</xy-select-option>
      </xy-select>
    </xy-form-item>
    <xy-form-item label="TreeSelect">
      <xy-tree-select :tree-data="treeData" />
    </xy-form-item>
    <xy-form-item label="Cascader">
      <xy-cascader :options="options" />
    </xy-form-item>
    <xy-form-item label="DatePicker">
      <xy-date-picker />
    </xy-form-item>
    <xy-form-item label="RangePicker">
      <xy-range-picker />
    </xy-form-item>
    <xy-form-item label="InputNumber">
      <xy-input-number />
    </xy-form-item>
    <xy-form-item label="TextArea">
      <xy-textarea :rows="4" />
    </xy-form-item>
    <xy-form-item label="Switch">
      <xy-switch v-model:checked="checked" />
    </xy-form-item>
    <xy-form-item label="Upload">
      <xy-upload action="/upload.do" list-type="picture-card">
        <div>
          <PlusOutlined />
          <div style="margin-top: 8px">Upload</div>
        </div>
      </xy-upload>
    </xy-form-item>
    <xy-form-item label="Button">
      <xy-button>Button</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { PlusOutlined } from '@xiaoye-ui/icons';
import type { TreeSelectProps, CascaderProps } from 'xiaoye-ui';

const componentDisabled = ref(true);
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
const radioValue = ref('apple');
const treeData = reactive<TreeSelectProps['treeData']>([
  { title: 'Light', value: 'light', children: [{ title: 'Bamboo', value: 'bamboo' }] },
]);
const options = reactive<CascaderProps['options']>([
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
      },
    ],
  },
]);
const checked = ref(false);
</script>
