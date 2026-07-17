<template>
  <xy-form v-bind="formItemLayout">
    <xy-form-item
      label="Fail"
      validate-status="error"
      help="Should be combination of numbers & alphabets"
    >
      <xy-input id="error" placeholder="unavailable choice" />
    </xy-form-item>

    <xy-form-item label="Warning" validate-status="warning">
      <xy-input id="warning" placeholder="Warning">
        <template #prefix><smile-outlined /></template>
      </xy-input>
    </xy-form-item>

    <xy-form-item
      label="Validating"
      has-feedback
      validate-status="validating"
      help="The information is being validated..."
    >
      <xy-input id="validating" placeholder="I'm the content is being validated" />
    </xy-form-item>

    <xy-form-item label="Success" has-feedback validate-status="success">
      <xy-input id="success" placeholder="I'm the content" />
    </xy-form-item>

    <xy-form-item label="Warning" has-feedback validate-status="warning">
      <xy-input id="warning2" placeholder="Warning" />
    </xy-form-item>

    <xy-form-item
      label="Fail"
      has-feedback
      validate-status="error"
      help="Should be combination of numbers & alphabets"
    >
      <xy-input id="error2" placeholder="unavailable choice" />
    </xy-form-item>

    <xy-form-item label="Success" has-feedback validate-status="success">
      <xy-date-picker style="width: 100%" />
    </xy-form-item>

    <xy-form-item label="Warning" has-feedback validate-status="warning">
      <xy-time-picker style="width: 100%" />
    </xy-form-item>

    <xy-form-item label="Error" has-feedback validate-status="error">
      <xy-range-picker style="width: 100%" />
    </xy-form-item>

    <xy-form-item label="Error" has-feedback validate-status="error">
      <xy-select placeholder="I'm Select" allow-clear>
        <xy-select-option value="1">Option 1</xy-select-option>
        <xy-select-option value="2">Option 2</xy-select-option>
        <xy-select-option value="3">Option 3</xy-select-option>
      </xy-select>
    </xy-form-item>

    <xy-form-item
      label="Validating"
      has-feedback
      validate-status="error"
      help="Something breaks the rule."
    >
      <xy-cascader
        placeholder="I'm Cascader"
        :options="[{ value: 'xx', label: 'xx' }]"
        allow-clear
      />
    </xy-form-item>

    <xy-form-item label="Warning" has-feedback validate-status="warning" help="Need to be checked">
      <xy-tree-select
        placeholder="I'm TreeSelect"
        :tree-data="[{ value: 'xx', label: 'xx' }]"
        allow-clear
      />
    </xy-form-item>

    <xy-form-item label="inline" style="margin-bottom: 0px">
      <xy-form-item
        validate-status="error"
        help="Please select right date"
        style="display: inline-block; width: calc(50% - 12px)"
      >
        <xy-date-picker />
      </xy-form-item>
      <span style="display: inline-block, width: 24px; line-height:32px; text-align: center">
        -
      </span>
      <xy-form-item style="display: inline-block; width: calc(50% - 12px)">
        <xy-date-picker />
      </xy-form-item>
    </xy-form-item>

    <xy-form-item label="Success" has-feedback validate-status="success">
      <xy-inputNumber style="width: 100%" />
    </xy-form-item>

    <xy-form-item label="Success" has-feedback validate-status="success">
      <xy-input allow-clear placeholder="with allowClear" />
    </xy-form-item>

    <xy-form-item label="Warning" has-feedback validate-status="warning">
      <xy-input-password placeholder="with input password" />
    </xy-form-item>

    <xy-form-item label="Error" has-feedback validate-status="error">
      <xy-input-password allow-clear placeholder="with input password and allowClear" />
    </xy-form-item>

    <xy-form-item label="Fail" validate-status="error" has-feedback>
      <xy-mentions />
    </xy-form-item>

    <xy-form-item label="Fail" validate-status="error" has-feedback help="Should have something">
      <xy-textarea allow-clear show-count />
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { SmileOutlined } from '@xiaoye-ui/icons';

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
