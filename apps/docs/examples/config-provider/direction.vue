<template>
  <span style="margin-right: 16px">Change direction of components:</span>
  <xy-radio-group v-model:value="state.direction">
    <xy-radio-button value="ltr">LTR</xy-radio-button>
    <xy-radio-button value="rtl">RTL</xy-radio-button>
  </xy-radio-group>
  <xy-divider />
  <xy-config-provider :direction="state.direction">
    <xy-space direction="vertical" class="direction-components">
      <xy-row>
        <xy-col :span="24">
          <xy-divider orientation="left">Cascader example</xy-divider>
          <xy-cascader
            :options="cascaderOptions"
            placeholder="یک مورد انتخاب کنید"
            :placement="state.popupPlacement"
            @change="onCascaderChange"
          >
            <template #suffixIcon><SearchIcon /></template>
          </xy-cascader>
          &nbsp;&nbsp;&nbsp;&nbsp; With search:
          <xy-cascader
            :options="cascaderOptions"
            placeholder="Select an item"
            :placement="state.popupPlacement"
            :show-search="{ filter: cascaderFilter }"
            @change="onCascaderChange"
          >
            <template #suffixIcon><SmileOutlined /></template>
          </xy-cascader>
        </xy-col>
      </xy-row>
      <xy-row>
        <xy-col :span="12">
          <xy-divider orientation="left">Switch example</xy-divider>
          <xy-space>
            <xy-switch default-checked />
            <xy-switch loading default-checked />
            <xy-switch size="small" loading />
          </xy-space>
        </xy-col>
        <xy-col :span="12">
          <xy-divider orientation="left">Radio Group example</xy-divider>
          <xy-radio-group default-value="c" button-style="solid">
            <xy-radio-button value="a">تهران</xy-radio-button>
            <xy-radio-button value="b" disabled>اصفهان</xy-radio-button>
            <xy-radio-button value="c">فارس</xy-radio-button>
            <xy-radio-button value="d">خوزستان</xy-radio-button>
          </xy-radio-group>
        </xy-col>
      </xy-row>
      <xy-row>
        <xy-col :span="12">
          <xy-divider orientation="left">Button example</xy-divider>
          <div class="button-demo">
            <xy-button type="primary">
              <template #icon><DownloadOutlined /></template>
            </xy-button>
            <xy-button type="primary" shape="circle">
              <template #icon><DownloadOutlined /></template>
            </xy-button>
            <xy-button type="primary" shape="round">
              <template #icon><DownloadOutlined /></template>
            </xy-button>
            <xy-button type="primary" shape="round">
              <template #icon><DownloadOutlined /></template>
              Download
            </xy-button>
            <xy-button type="primary">
              <template #icon><DownloadOutlined /></template>
              Download
            </xy-button>
            <br />
            <xy-button-group>
              <xy-button type="primary">
                <LeftOutlined />
                Backward
              </xy-button>
              <xy-button type="primary">
                Forward
                <RightOutlined />
              </xy-button>
            </xy-button-group>
            <xy-button type="primary" loading>Loading</xy-button>
            <xy-button type="primary" size="small" loading>Loading</xy-button>
          </div>
        </xy-col>
        <xy-col :span="12">
          <xy-divider orientation="left">Tree example</xy-divider>
          <xy-tree
            v-model:expanded-keys="expandedKeys"
            v-model:selected-keys="selectedKeys"
            v-model:checked-keys="checkedKeys"
            show-line
            checkable
            :tree-data="treeData"
          >
            <template #title="{ title, key }">
              <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
              <template v-else>{{ title }}</template>
            </template>
          </xy-tree>
        </xy-col>
      </xy-row>
      <xy-row>
        <xy-col :span="24">
          <xy-divider orientation="left">Input (Input Group) example</xy-divider>
          <xy-space direction="vertical" style="width: 100%">
            <xy-input-group size="large">
              <xy-row :gutter="8">
                <xy-col :span="5">
                  <xy-input default-value="0571" />
                </xy-col>
                <xy-col :span="8">
                  <xy-input default-value="26888888" />
                </xy-col>
              </xy-row>
            </xy-input-group>
            <xy-input-group compact>
              <xy-input style="width: 20%" default-value="0571" />
              <xy-input style="width: 30%" default-value="26888888" />
            </xy-input-group>
            <xy-input-group compact>
              <xy-select default-value="Option1">
                <xy-select-option value="Option1">Option1</xy-select-option>
                <xy-select-option value="Option2">Option2</xy-select-option>
              </xy-select>
              <xy-input style="width: 50%" default-value="input content" />
              <xy-inputNumber />
            </xy-input-group>
            <xy-input-search placeholder="input search text" enter-button="Search" size="large" />
            <div style="margin-bottom: 16px">
              <xy-input default-value="mysite">
                <template #selectBefore>
                  <xy-select default-value="Http://" style="width: 90px">
                    <xy-select-option value="Http://">Http://</xy-select-option>
                    <xy-select-option value="Https://">Https://</xy-select-option>
                  </xy-select>
                </template>
                <template #selectAfter>
                  <xy-select default-value=".com" style="width: 80px">
                    <xy-select-option value=".com">.com</xy-select-option>
                    <xy-select-option value=".jp">.jp</xy-select-option>
                    <xy-select-option value=".cn">.cn</xy-select-option>
                    <xy-select-option value=".org">.org</xy-select-option>
                  </xy-select>
                </template>
              </xy-input>
            </div>
            <xy-row>
              <xy-col :span="12">
                <xy-divider orientation="left">Select example</xy-divider>
                <xy-space wrap>
                  <xy-select mode="multiple" default-value="مورچه" style="width: 120px">
                    <xy-select-option value="jack">Jack</xy-select-option>
                    <xy-select-option value="مورچه">مورچه</xy-select-option>
                    <xy-select-option value="disabled" disabled>Disabled</xy-select-option>
                    <xy-select-option value="Yiminghe">yiminghe</xy-select-option>
                  </xy-select>
                  <xy-select default-value="مورچه" style="width: 120px" disabled>
                    <xy-select-option value="مورچه">مورچه</xy-select-option>
                  </xy-select>
                  <xy-select default-value="مورچه" style="width: 120px" loading>
                    <xy-select-option value="مورچه">مورچه</xy-select-option>
                  </xy-select>
                  <xy-select
                    show-search
                    style="width: 200px"
                    placeholder="Select a person"
                    option-filter-prop="children"
                    :filter-option="
                      (input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    "
                  >
                    <xy-select-option value="jack">Jack</xy-select-option>
                    <xy-select-option value="سعید">سعید</xy-select-option>
                    <xy-select-option value="tom">Tom</xy-select-option>
                  </xy-select>
                </xy-space>
              </xy-col>
              <xy-col :span="12">
                <xy-divider orientation="left">TreeSelect example</xy-divider>
                <div>
                  <xy-tree-select
                    show-search
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="Please select"
                    allow-clear
                    tree-default-expand-all
                    :tree-data="treeSelectData"
                  ></xy-tree-select>
                </div>
              </xy-col>
            </xy-row>
            <xy-row>
              <xy-col :span="24">
                <xy-divider orientation="left">Modal example</xy-divider>
                <div>
                  <xy-button type="primary" @click="showModal">Open Modal</xy-button>
                  <xy-modal v-model:open="state.modalVisible" title="پنچره ساده">
                    <p>نگاشته‌های خود را اینجا قراردهید</p>
                    <p>نگاشته‌های خود را اینجا قراردهید</p>
                    <p>نگاشته‌های خود را اینجا قراردهید</p>
                  </xy-modal>
                </div>
              </xy-col>
            </xy-row>
            <xy-row>
              <xy-col :span="24">
                <xy-divider orientation="left">Steps example</xy-divider>
                <div>
                  <xy-steps
                    progress-dot
                    :current="state.currentStep"
                    :items="[
                      {
                        title: 'Finished',
                        description: 'This is a description.',
                      },
                      {
                        title: 'In Progress',
                        description: 'This is a description.',
                      },
                      {
                        title: 'Waiting',
                        description: 'This is a description.',
                      },
                    ]"
                  ></xy-steps>
                  <br />
                  <xy-steps
                    :current="state.currentStep"
                    :items="[
                      {
                        title: 'Step 1',
                        description: 'This is a description.',
                      },
                      {
                        title: 'Step 2',
                        description: 'This is a description.',
                      },
                      {
                        title: 'Step 3',
                        description: 'This is a description.',
                      },
                    ]"
                    @change="onStepsChange"
                  ></xy-steps>
                </div>
              </xy-col>
            </xy-row>
            <xy-row>
              <xy-col :span="12">
                <xy-divider orientation="left">Rate example</xy-divider>
                <div>
                  <xy-rate v-model:value="rateValue" />
                  <br />
                  <strong>* Note:</strong>
                  Half star not implemented in RTL direction.
                </div>
              </xy-col>
              <xy-col :span="12">
                <xy-divider orientation="left">Badge example</xy-divider>
                <div>
                  <div>
                    <xy-badge :count="state.badgeCount">
                      <a href="#" class="head-example" />
                    </xy-badge>
                    <xy-button-group>
                      <xy-button @click="declineBadge">
                        <MinusOutlined />
                      </xy-button>
                      <xy-button @click="increaseBadge">
                        <PlusOutlined />
                      </xy-button>
                    </xy-button-group>
                  </div>
                  <div style="margin-top: 10px">
                    <xy-badge :dot="state.showBadge">
                      <a href="#" class="head-example" />
                    </xy-badge>
                    <xy-switch :checked="state.showBadge" @change="onChangeBadge" />
                  </div>
                </div>
              </xy-col>
            </xy-row>
          </xy-space>
        </xy-col>
      </xy-row>
      <xy-row>
        <xy-col :span="24">
          <xy-divider orientation="left">Pagination example</xy-divider>
          <xy-pagination show-size-changer :default-current="3" :total="500" />
        </xy-col>
      </xy-row>
      <xy-row>
        <xy-col :span="24">
          <xy-divider orientation="left">Grid System example</xy-divider>
          <div class="grid-demo">
            <div class="code-box-demo">
              <p>
                <strong>* Note:</strong>
                Every calculation in RTL grid system is from right side (offset, push, etc.)
              </p>
              <xy-row>
                <xy-col :span="8">col-8</xy-col>
                <xy-col :span="8" :offset="8">col-8</xy-col>
              </xy-row>
              <xy-row>
                <xy-col :span="6" :offset="6">col-6 col-offset-6</xy-col>
                <xy-col :span="6" :offset="6">col-6 col-offset-6</xy-col>
              </xy-row>
              <xy-row>
                <xy-col :span="12" :offset="6">col-12 col-offset-6</xy-col>
              </xy-row>
              <xy-row>
                <xy-col :span="18" :push="6">col-18 col-push-6</xy-col>
                <xy-col :span="6" :pull="18">col-6 col-pull-18</xy-col>
              </xy-row>
            </div>
          </div>
        </xy-col>
      </xy-row>
    </xy-space>
  </xy-config-provider>
</template>
<script lang="ts" setup>
import { reactive, watch, ref } from 'vue';

import {
  SearchOutlined as SearchIcon,
  SmileOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@xiaoye-ui/icons';
import type { TreeProps, TreeSelectProps, CascaderProps } from 'xiaoye-ui';

const state = reactive({
  currentStep: 0,
  modalVisible: false,

  badgeCount: 5,
  showBadge: true,
  direction: 'ltr' as 'ltr' | 'rtl',
  popupPlacement: 'bottomLeft' as CascaderProps['placement'],
});
const expandedKeys = ref<string[]>(['0-0-0', '0-0-1']);
const selectedKeys = ref<string[]>(['0-0-0', '0-0-1']);
const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);

const treeData: TreeProps['treeData'] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
          { title: 'leaf', key: '0-0-0-1' },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ key: '0-0-1-0', title: 'sss' }],
      },
    ],
  },
];

const treeSelectData = ref<TreeSelectProps['treeData']>([
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
watch(
  () => state.direction,
  directionValue => {
    if (directionValue === 'rtl') {
      state.popupPlacement = 'bottomRight';
    } else {
      state.popupPlacement = 'bottomLeft';
    }
  },
);
const cascaderOptions = [
  {
    value: 'tehran',
    label: 'تهران',
    children: [
      {
        value: 'tehran-c',
        label: 'تهران',
        children: [
          {
            value: 'saadat-abad',
            label: 'سعادت آیاد',
          },
        ],
      },
    ],
  },
  {
    value: 'ardabil',
    label: 'اردبیل',
    children: [
      {
        value: 'ardabil-c',
        label: 'اردبیل',
        children: [
          {
            value: 'primadar',
            label: 'پیرمادر',
          },
        ],
      },
    ],
  },
  {
    value: 'gilan',
    label: 'گیلان',
    children: [
      {
        value: 'rasht',
        label: 'رشت',
        children: [
          {
            value: 'district-3',
            label: 'منطقه ۳',
          },
        ],
      },
    ],
  },
];

// ==== Cascader ====
const cascaderFilter = (inputValue, path) =>
  path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

const onCascaderChange = value => {
  console.log(value);
};
// ==== End Cascader ====

// ==== Modal ====
const showModal = () => {
  state.modalVisible = true;
};

// ==== End Modal ====

const onStepsChange = currentStep => {
  console.log('onChange:', currentStep);
  state.currentStep = currentStep;
};

// ==== Badge ====

const increaseBadge = () => {
  const badgeCount = state.badgeCount + 1;
  state.badgeCount = badgeCount;
};

const declineBadge = () => {
  let badgeCount = state.badgeCount - 1;
  if (badgeCount < 0) {
    badgeCount = 0;
  }
  state.badgeCount = badgeCount;
};

const onChangeBadge = showBadge => {
  state.showBadge = showBadge;
};
const rateValue = ref(2);
</script>
<style lang="less" scoped>
.direction-components {
  width: 100%;
  .button-demo .xy-btn,
  .button-demo .xy-btn-group {
    margin-right: 8px;
    margin-bottom: 12px;
  }
  .button-demo .xy-btn-group > .xy-btn,
  .button-demo .xy-btn-group > span > .xy-btn {
    margin-right: 0;
    margin-left: 0;
  }

  .head-example {
    display: inline-block;
    width: 42px;
    height: 42px;
    vertical-align: middle;
    background: #eee;
    border-radius: 4px;
  }

  .xy-badge:not(.xy-badge-not-a-wrapper) {
    margin-right: 20px;
  }
  .xy-badge-rtl:not(.xy-badge-not-a-wrapper) {
    margin-right: 0;
    margin-left: 20px;
  }
}

[data-theme='dark'] .head-example {
  background: rgba(255, 255, 255, 0.12);
}
</style>
