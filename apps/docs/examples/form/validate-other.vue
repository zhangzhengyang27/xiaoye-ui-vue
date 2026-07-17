<template>
  <xy-form
    :model="formState"
    name="validate_other"
    v-bind="formItemLayout"
    @finishFailed="onFinishFailed"
    @finish="onFinish"
  >
    <xy-form-item label="Plain Text">
      <span class="xy-form-text">China</span>
    </xy-form-item>
    <xy-form-item
      name="select"
      label="Select"
      has-feedback
      :rules="[{ required: true, message: 'Please select your country!' }]"
    >
      <xy-select v-model:value="formState.select" placeholder="Please select a country">
        <xy-select-option value="china">China</xy-select-option>
        <xy-select-option value="usa">U.S.A</xy-select-option>
      </xy-select>
    </xy-form-item>

    <xy-form-item
      name="select-multiple"
      label="Select[multiple]"
      :rules="[{ required: true, message: 'Please select your favourite colors!', type: 'array' }]"
    >
      <xy-select
        v-model:value="formState['select-multiple']"
        mode="multiple"
        placeholder="Please select favourite colors"
      >
        <xy-select-option value="red">Red</xy-select-option>
        <xy-select-option value="green">Green</xy-select-option>
        <xy-select-option value="blue">Blue</xy-select-option>
      </xy-select>
    </xy-form-item>

    <xy-form-item label="InputNumber">
      <xy-form-item name="input-number" no-style>
        <xy-input-number v-model:value="formState['input-number']" :min="1" :max="10" />
      </xy-form-item>
      <span class="xy-form-text">machines</span>
    </xy-form-item>

    <xy-form-item name="switch" label="Switch">
      <xy-switch v-model:checked="formState.switch" />
    </xy-form-item>

    <xy-form-item name="slider" label="Slider">
      <xy-slider
        v-model:value="formState.slider"
        :marks="{
          0: 'A',
          20: 'B',
          40: 'C',
          60: 'D',
          80: 'E',
          100: 'F',
        }"
      />
    </xy-form-item>

    <xy-form-item name="radio-group" label="Radio.Group">
      <xy-radio-group v-model:value="formState['radio-group']">
        <xy-radio value="a">item 1</xy-radio>
        <xy-radio value="b">item 2</xy-radio>
        <xy-radio value="c">item 3</xy-radio>
      </xy-radio-group>
    </xy-form-item>

    <xy-form-item
      name="radio-button"
      label="Radio.Button"
      :rules="[{ required: true, message: 'Please pick an item!' }]"
    >
      <xy-radio-group v-model:value="formState['radio-button']">
        <xy-radio-button value="a">item 1</xy-radio-button>
        <xy-radio-button value="b">item 2</xy-radio-button>
        <xy-radio-button value="c">item 3</xy-radio-button>
      </xy-radio-group>
    </xy-form-item>

    <xy-form-item name="checkbox-group" label="Checkbox.Group">
      <xy-checkbox-group v-model:value="formState['checkbox-group']">
        <xy-row>
          <xy-col :span="8">
            <xy-checkbox value="A" style="line-height: 32px">A</xy-checkbox>
          </xy-col>
          <xy-col :span="8">
            <xy-checkbox value="B" style="line-height: 32px" disabled>B</xy-checkbox>
          </xy-col>
          <xy-col :span="8">
            <xy-checkbox value="C" style="line-height: 32px">C</xy-checkbox>
          </xy-col>
          <xy-col :span="8">
            <xy-checkbox value="D" style="line-height: 32px">D</xy-checkbox>
          </xy-col>
          <xy-col :span="8">
            <xy-checkbox value="E" style="line-height: 32px">E</xy-checkbox>
          </xy-col>
          <xy-col :span="8">
            <xy-checkbox value="F" style="line-height: 32px">F</xy-checkbox>
          </xy-col>
        </xy-row>
      </xy-checkbox-group>
    </xy-form-item>

    <xy-form-item name="rate" label="Rate">
      <xy-rate v-model:value="formState.rate" allow-half />
    </xy-form-item>

    <xy-form-item name="upload" label="Upload" extra="longgggggggggggggggggggggggggggggggggg">
      <xy-upload
        v-model:file-list="formState.upload"
        name="logo"
        action="/upload.do"
        list-type="picture"
      >
        <xy-button>
          <template #icon><UploadOutlined /></template>
          Click to upload
        </xy-button>
      </xy-upload>
    </xy-form-item>

    <xy-form-item label="Dragger">
      <xy-form-item name="dragger" no-style>
        <xy-upload-dragger v-model:file-list="formState.dragger" name="files" action="/upload.do">
          <p class="xy-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="xy-upload-text">Click or drag file to this area to upload</p>
          <p class="xy-upload-hint">Support for a single or bulk upload.</p>
        </xy-upload-dragger>
      </xy-form-item>
    </xy-form-item>

    <xy-form-item :wrapper-col="{ span: 12, offset: 6 }">
      <xy-button type="primary" html-type="submit">Submit</xy-button>
    </xy-form-item>
  </xy-form>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { UploadOutlined, InboxOutlined } from '@xiaoye-ui/icons';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const formState = reactive<Record<string, any>>({
  'input-number': 3,
  'checkbox-group': ['A', 'B'],
  rate: 3.5,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>
