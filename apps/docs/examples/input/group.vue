<template>
  <xy-space class="site-input-group-wrapper" direction="vertical" size="middle">
    <xy-input-group size="large">
      <xy-row :gutter="8">
        <xy-col :span="5">
          <xy-input v-model:value="value1" />
        </xy-col>
        <xy-col :span="8">
          <xy-input v-model:value="value2" />
        </xy-col>
      </xy-row>
    </xy-input-group>
    <xy-input-group compact>
      <xy-input v-model:value="value1" style="width: 20%" />
      <xy-input v-model:value="value2" style="width: 30%" />
    </xy-input-group>
    <xy-input-group compact>
      <xy-select v-model:value="value3">
        <xy-select-option value="Zhejiang">Zhejiang</xy-select-option>
        <xy-select-option value="Jiangsu">Jiangsu</xy-select-option>
      </xy-select>
      <xy-input v-model:value="value4" style="width: 50%" />
    </xy-input-group>
    <xy-input-group compact>
      <xy-select v-model:value="value5">
        <xy-select-option value="Option1">Option1</xy-select-option>
        <xy-select-option value="Option2">Option2</xy-select-option>
      </xy-select>
      <xy-input v-model:value="value6" style="width: 50%" />
    </xy-input-group>
    <xy-input-group compact>
      <xy-input v-model:value="value7" style="width: 50%" />
      <xy-date-picker v-model:value="value8" style="width: 50%" />
    </xy-input-group>
    <xy-input-group compact>
      <xy-select v-model:value="value9">
        <xy-select-option value="Option1-1">Option1-1</xy-select-option>
        <xy-select-option value="Option1-2">Option1-2</xy-select-option>
      </xy-select>
      <xy-select v-model:value="value10">
        <xy-select-option value="Option2-1">Option2-1</xy-select-option>
        <xy-select-option value="Option2-2">Option2-2</xy-select-option>
      </xy-select>
    </xy-input-group>
    <xy-input-group compact>
      <xy-select v-model:value="value11">
        <xy-select-option value="1">Between</xy-select-option>
        <xy-select-option value="2">Except</xy-select-option>
      </xy-select>
      <xy-input
        v-model:value="value12"
        style="width: 100px; text-align: center"
        placeholder="Minimum"
      />
      <xy-input
        v-model:value="value13"
        class="site-input-split"
        style="width: 30px; border-left: 0; pointer-events: none"
        placeholder="~"
        disabled
      />
      <xy-input
        v-model:value="value14"
        class="site-input-right"
        style="width: 100px; text-align: center"
        placeholder="Maximum"
      />
    </xy-input-group>
    <xy-input-group compact>
      <xy-select v-model:value="value15">
        <xy-select-option value="Sign Up">Sign Up</xy-select-option>
        <xy-select-option value="Sign In">Sign In</xy-select-option>
      </xy-select>
      <xy-auto-complete
        v-model:value="value16"
        :options="[{ value: 'text 1' }, { value: 'text 2' }]"
        style="width: 200px"
        placeholder="Email"
      />
    </xy-input-group>
    <xy-input-group compact>
      <xy-select v-model:value="value17" style="width: 30%">
        <xy-select-option value="Home">Home</xy-select-option>
        <xy-select-option value="Company">Company</xy-select-option>
      </xy-select>
      <xy-cascader
        v-model:value="value18"
        style="width: 70%"
        :options="options"
        placeholder="Select Address"
      />
    </xy-input-group>
    <xy-input-group compact>
      <xy-input v-model:value="value19" style="width: calc(100% - 200px)" />
      <xy-button type="primary">Submit</xy-button>
    </xy-input-group>
    <xy-input-group compact>
      <xy-input v-model:value="value20" style="width: calc(100% - 200px)" />
      <xy-tooltip title="copy git url">
        <xy-button>
          <template #icon><CopyOutlined /></template>
        </xy-button>
      </xy-tooltip>
    </xy-input-group>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { CopyOutlined } from '@xiaoye-ui/icons';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
const value1 = ref<string>('0571');
const value2 = ref<string>('26888888');
const value3 = ref<string>('Zhejiang');
const value4 = ref<string>('Xihu District, Hangzhou');
const value5 = ref<string>('Option1');
const value6 = ref<string>('input content');
const value7 = ref<string>('input content');
const value8 = ref<string | null>(null);
const value9 = ref<string>('Option1-1');
const value10 = ref<string>('Option2-2');
const value11 = ref<string>('1');
const value12 = ref<string>('');
const value13 = ref<string>('');
const value14 = ref<string>('');
const value15 = ref<string>('Sign Up');
const value16 = ref<string>('');
const value17 = ref<string>('Home');
const value18 = ref<string[]>([]);
const value19 = ref<string>('https://surelyvue.com');
const value20 = ref<string>('https://xiaoye-ui.github.io');
</script>
<style scoped>
.site-input-group-wrapper .site-input-split {
  background-color: #fff;
}

.site-input-group-wrapper .site-input-right {
  border-left-width: 0;
}

.site-input-group-wrapper .site-input-right:hover,
.site-input-group-wrapper .site-input-right:focus {
  border-left-width: 1px;
}

.site-input-group-wrapper .xy-input-rtl.site-input-right {
  border-right-width: 0;
}

.site-input-group-wrapper .xy-input-rtl.site-input-right:hover,
.site-input-group-wrapper .xy-input-rtl.site-input-right:focus {
  border-right-width: 1px;
}
[data-theme='dark'] .site-input-group-wrapper .site-input-split {
  background-color: transparent;
}
</style>
