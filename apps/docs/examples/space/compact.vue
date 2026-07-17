<template>
  <xy-space direction="vertical" size="middle" class="site-space-compact-wrapper">
    <xy-space-compact block>
      <xy-input :style="{ width: '20%' }" default-value="0571" />
      <xy-input :style="{ width: '30%' }" default-value="26888888" />
    </xy-space-compact>
    <xy-space-compact block size="small">
      <xy-input :style="{ width: 'calc(100% - 200px)' }" default-value="https://example.com" />
      <xy-button type="primary">Submit</xy-button>
    </xy-space-compact>
    <xy-space-compact block>
      <xy-input :style="{ width: 'calc(100% - 200px)' }" default-value="https://example.com" />
      <xy-button type="primary">Submit</xy-button>
    </xy-space-compact>
    <xy-space-compact block>
      <xy-input
        :style="{ width: 'calc(100% - 200px)' }"
        default-value="git@github.com:xiaoye-ui/xiaoye-ui.git"
      />
      <xy-tooltip title="copy git url">
        <xy-button>
          <CopyOutlined />
        </xy-button>
      </xy-tooltip>
    </xy-space-compact>
    <xy-space-compact block>
      <xy-select default-value="Zhejiang" allow-clear>
        <xy-select-option value="Zhejiang">Zhejiang</xy-select-option>
        <xy-select-option value="Jiangsu">Jiangsu</xy-select-option>
      </xy-select>
      <xy-input :style="{ width: '50%' }" default-value="Xihu District, Hangzhou" />
    </xy-space-compact>
    <xy-space-compact block>
      <xy-select allow-clear mode="multiple" default-value="Zhejianggggg" :style="{ width: '50%' }">
        <xy-select-option value="Zhejianggggg">Zhejianggggg</xy-select-option>
        <xy-select-option value="Jiangsu">Jiangsu</xy-select-option>
      </xy-select>
      <xy-input :style="{ width: '50%' }" default-value="Xihu District, Hangzhou" />
    </xy-space-compact>
    <xy-space-compact block>
      <xy-input-search :style="{ width: '30%' }" default-value="0571" />
      <xy-input-search allow-clear :style="{ width: '50%' }" default-value="26888888" />
      <xy-input-search :style="{ width: '20%' }" default-value="+1" />
    </xy-space-compact>
    <xy-space-compact block>
      <xy-select default-value="Option1">
        <xy-select-option value="Option1">Option1</xy-select-option>
        <xy-select-option value="Option2">Option2</xy-select-option>
      </xy-select>
      <xy-input :style="{ width: '50%' }" default-value="input content" />
      <xy-input-number :default-value="12" />
    </xy-space-compact>
    <xy-space-compact block>
      <xy-input :style="{ width: '50%' }" default-value="input content" />
      <xy-date-picker :style="{ width: '50%' }" />
    </xy-space-compact>
    <xy-space-compact block>
      <xy-range-picker :style="{ width: '70%' }" />
      <xy-input :style="{ width: '30%' }" default-value="input content" />
      <xy-button type="primary">查询</xy-button>
    </xy-space-compact>
    <xy-space-compact block>
      <xy-input :style="{ width: '30%' }" default-value="input content" />
      <xy-range-picker :style="{ width: '70%' }" />
    </xy-space-compact>
    <xy-space-compact block>
      <xy-select default-value="Option1-1">
        <xy-select-option value="Option1-1">Option1-1</xy-select-option>
        <xy-select-option value="Option1-2">Option1-2</xy-select-option>
      </xy-select>
      <xy-select default-value="Option2-2">
        <xy-select-option value="Option2-1">Option2-1</xy-select-option>
        <xy-select-option value="Option2-2">Option2-2</xy-select-option>
      </xy-select>
    </xy-space-compact>
    <xy-space-compact block>
      <xy-select default-value="1">
        <xy-select-option value="1">Between</xy-select-option>
        <xy-select-option value="2">Except</xy-select-option>
      </xy-select>
      <xy-input :style="{ width: 100, textAlig: 'center' }" placeholder="Minimum" />
      <xy-input
        class="site-input-split"
        :style="{
          width: 30,
          borderLef: 0,
          borderRight: 0,
          pointerEvents: 'none',
        }"
        placeholder="~"
        disabled
      />
      <xy-input
        class="site-input-right"
        :style="{
          width: 100,
          textAlig: 'center',
        }"
        placeholder="Maximum"
      />
    </xy-space-compact>
    <xy-space-compact block>
      <xy-select default-value="Sign Up" :style="{ width: '30%' }">
        <xy-select-option value="Sign Up">Sign Up</xy-select-option>
        <xy-select-option value="Sign In">Sign In</xy-select-option>
      </xy-select>
      <xy-auto-complete
        :style="{ width: '70%' }"
        placeholder="Email"
        :options="[{ value: 'text 1' }, { value: 'text 2' }]"
      />
    </xy-space-compact>
    <xy-space-compact block>
      <xy-time-picker :style="{ width: '70%' }" />
      <xy-cascader
        :style="{ width: '70%' }"
        :options="[
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
        ]"
        placeholder="Select Address"
      />
    </xy-space-compact>
    <xy-space-compact block>
      <xy-time-range-picker />
      <xy-tree-select
        show-search
        :style="{ width: '60%' }"
        value="leaf1"
        :dropdown-style="{ maxHeight: 400, overflow: 'auto' }"
        placeholder="Please select"
        allow-clear
        tree-default-expand-all
        :tree-data="treeData"
      ></xy-tree-select>
      <xy-button type="primary">Submit</xy-button>
    </xy-space-compact>
  </xy-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { CopyOutlined } from '@xiaoye-ui/icons';
import { TreeSelectProps } from 'xiaoye-ui';

const treeData = ref<TreeSelectProps['treeData']>([
  {
    title: 'parent 1',
    value: 'parent 1',
    children: [
      {
        title: 'parent 1-0',
        value: 'parent 1-0',
        children: [
          {
            title: 'my leaf',
            value: 'leaf1',
          },
          {
            title: 'your leaf',
            value: 'leaf2',
          },
        ],
      },
      {
        title: 'parent 1-1',
        value: 'parent 1-1',
      },
    ],
  },
]);
</script>
