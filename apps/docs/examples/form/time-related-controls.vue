<template>
  <a-form
    :model="formState"
    name="time_related_controls"
    v-bind="formItemLayout"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item name="date-picker" label="DatePicker" v-bind="config">
      <a-date-picker v-model:value="formState['date-picker']" value-format="YYYY-MM-DD" />
    </a-form-item>
    <a-form-item name="date-time-picker" label="DatePicker[showTime]" v-bind="config">
      <a-date-picker
        v-model:value="formState['date-time-picker']"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </a-form-item>
    <a-form-item name="month-picker" label="MonthPicker" v-bind="config">
      <a-date-picker
        v-model:value="formState['month-picker']"
        value-format="YYYY-MM"
        picker="month"
      />
    </a-form-item>
    <a-form-item name="range-picker" label="RangePicker" v-bind="rangeConfig">
      <a-range-picker v-model:value="formState['range-picker']" value-format="YYYY-MM-DD" />
    </a-form-item>
    <a-form-item name="range-time-picker" label="RangePicker[showTime]" v-bind="rangeConfig">
      <a-range-picker
        v-model:value="formState['range-time-picker']"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </a-form-item>
    <a-form-item name="time-picker" label="TimePicker" v-bind="config">
      <a-time-picker
        v-model:value="formState['time-picker']"
        format="HH:mm:ss"
        value-format="HH:mm:ss"
      />
    </a-form-item>
    <a-form-item
      :wrapper-col="{
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
      }"
    >
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';

interface FormState {
  'date-picker': string;
  'date-time-picker': string;
  'month-picker': string;
  'range-picker': [string, string];
  'range-time-picker': [string, string];
  'time-picker': string;
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const config = {
  rules: [{ type: 'string' as const, required: true, message: 'Please select time!' }],
};
const rangeConfig = {
  rules: [{ type: 'array' as const, required: true, message: 'Please select time!' }],
};
const formState = reactive({} as FormState);
const onFinish = (values: any) => {
  console.log('Success:', values, formState);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>
