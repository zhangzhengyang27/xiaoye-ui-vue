<template>
  <a-form v-bind="formItemLayout">
    <a-form-item
      label="Fail"
      validate-status="error"
      help="Should be combination of numbers & alphabets"
    >
      <a-input id="error" placeholder="unavailable choice" />
    </a-form-item>

    <a-form-item label="Warning" validate-status="warning">
      <a-input id="warning" placeholder="Warning">
        <template #prefix><smile-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="Validating"
      has-feedback
      validate-status="validating"
      help="The information is being validated..."
    >
      <a-input id="validating" placeholder="I'm the content is being validated" />
    </a-form-item>

    <a-form-item label="Success" has-feedback validate-status="success">
      <a-input id="success" placeholder="I'm the content" />
    </a-form-item>

    <a-form-item label="Warning" has-feedback validate-status="warning">
      <a-input id="warning2" placeholder="Warning" />
    </a-form-item>

    <a-form-item
      label="Fail"
      has-feedback
      validate-status="error"
      help="Should be combination of numbers & alphabets"
    >
      <a-input id="error2" placeholder="unavailable choice" />
    </a-form-item>

    <a-form-item label="Success" has-feedback validate-status="success">
      <a-date-picker style="width: 100%" />
    </a-form-item>

    <a-form-item label="Warning" has-feedback validate-status="warning">
      <a-time-picker style="width: 100%" />
    </a-form-item>

    <a-form-item label="Error" has-feedback validate-status="error">
      <a-range-picker style="width: 100%" />
    </a-form-item>

    <a-form-item label="Error" has-feedback validate-status="error">
      <a-select placeholder="I'm Select" allow-clear>
        <a-select-option value="1">Option 1</a-select-option>
        <a-select-option value="2">Option 2</a-select-option>
        <a-select-option value="3">Option 3</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="Validating"
      has-feedback
      validate-status="error"
      help="Something breaks the rule."
    >
      <a-cascader
        placeholder="I'm Cascader"
        :options="[{ value: 'xx', label: 'xx' }]"
        allow-clear
      />
    </a-form-item>

    <a-form-item label="Warning" has-feedback validate-status="warning" help="Need to be checked">
      <a-tree-select
        placeholder="I'm TreeSelect"
        :tree-data="[{ value: 'xx', label: 'xx' }]"
        allow-clear
      />
    </a-form-item>

    <a-form-item label="inline" style="margin-bottom: 0px">
      <a-form-item
        validate-status="error"
        help="Please select right date"
        style="display: inline-block; width: calc(50% - 12px)"
      >
        <a-date-picker />
      </a-form-item>
      <span style="display: inline-block, width: 24px; line-height:32px; text-align: center">
        -
      </span>
      <a-form-item style="display: inline-block; width: calc(50% - 12px)">
        <a-date-picker />
      </a-form-item>
    </a-form-item>

    <a-form-item label="Success" has-feedback validate-status="success">
      <a-inputNumber style="width: 100%" />
    </a-form-item>

    <a-form-item label="Success" has-feedback validate-status="success">
      <a-input allow-clear placeholder="with allowClear" />
    </a-form-item>

    <a-form-item label="Warning" has-feedback validate-status="warning">
      <a-input-password placeholder="with input password" />
    </a-form-item>

    <a-form-item label="Error" has-feedback validate-status="error">
      <a-input-password allow-clear placeholder="with input password and allowClear" />
    </a-form-item>

    <a-form-item label="Fail" validate-status="error" has-feedback>
      <a-mentions />
    </a-form-item>

    <a-form-item label="Fail" validate-status="error" has-feedback help="Should have something">
      <a-textarea allow-clear show-count />
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { SmileOutlined } from '@ant-design/icons-vue';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
</script>
