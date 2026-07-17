<template>
  <div style="margin-bottom: 16px">
    <span style="margin-right: 16px">Change locale of components:</span>
    <xy-radio-group v-model:value="locale">
      <xy-radio-button key="en" :value="enUS.locale">English</xy-radio-button>
      <xy-radio-button key="cn" :value="zhCN.locale">中文</xy-radio-button>
    </xy-radio-group>
  </div>
  <xy-config-provider :locale="locale === 'en' ? enUS : zhCN">
    <xy-space
      direction="vertical"
      :size="[0, 16]"
      :style="{ width: '100%', paddingTop: '16px', borderTop: `1px solid ${token.colorBorder}` }"
    >
      <xy-pagination :total="50" show-size-changer />
      <xy-space wrap>
        <xy-select show-search style="width: 200px">
          <xy-select-option value="jack">jack</xy-select-option>
          <xy-select-option value="lucy">lucy</xy-select-option>
        </xy-select>
        <xy-date-picker />
        <xy-time-picker />
        <xy-range-picker style="width: 200px" />
      </xy-space>
      <xy-space wrap>
        <xy-button type="primary" @click="visible = true">Show Modal</xy-button>
        <xy-button @click="info">Show info</xy-button>
        <xy-button @click="confirm">Show confirm</xy-button>
        <xy-popconfirm title="Question?">
          <a href="#">Click to confirm</a>
        </xy-popconfirm>
      </xy-space>
      <xy-transfer :data-source="[]" show-search :target-keys="[]" :render="item => item.title" />
      <div
        :style="{
          width: '320px',
          border: `1px solid ${token.colorBorder}`,
          'border-radius': '8px',
        }"
      >
        <xy-calendar :fullscreen="false" />
      </div>
      <xy-form
        name="basic"
        :model="formModel"
        auto-complete="off"
        :label-col="{ sm: { span: 4 } }"
        :wrapper-col="{ span: 6 }"
      >
        <xy-form-item label="UserName" name="username" :rules="[{ required: true }]">
          <xy-input v-model:value="formModel.username" :width="200" />
        </xy-form-item>
        <xy-form-item label="Age" name="age" :rules="[{ type: 'number', min: 0, max: 99 }]">
          <xy-input-number v-model:value="formModel.age" :width="200" />
        </xy-form-item>
        <xy-form-item :wrapper-col="{ offset: 2, span: 6 }">
          <xy-button type="primary" html-type="submit">submit</xy-button>
        </xy-form-item>
      </xy-form>
      <xy-table :data-source="[]" :columns="columns" />
      <xy-modal v-model:open="visible" title="Locale Modal">
        <p>Locale Modal</p>
      </xy-modal>
      <xy-space wrap :size="80">
        <xy-qrcode
          value="https://xiaoye-ui.github.io"
          status="expired"
          @refresh="() => console.log('refresh')"
        />
        <xy-image
          :width="160"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </xy-space>
      <xy-upload list-type="picture-card" :file-list="fileList" />
      <xy-divider orientation="left">Tour</xy-divider>
      <xy-button type="primary" @click="() => (tourOpen = true)">Begin Tour</xy-button>
      <xy-space>
        <xy-button ref="ref1">upload</xy-button>
        <xy-button ref="ref2" type="primary">save</xy-button>
        <xy-button ref="ref3">
          <template #icon>
            <ellipsis-outlined />
          </template>
        </xy-button>
      </xy-space>
      <xy-tour
        v-model:current="current"
        :open="tourOpen"
        :steps="steps"
        @close="() => (tourOpen = false)"
      ></xy-tour>
    </xy-space>
  </xy-config-provider>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Modal, theme } from 'xiaoye-ui';
import type { TourProps, UploadFile } from 'xiaoye-ui';
import { EllipsisOutlined } from '@xiaoye-ui/icons';
import enUS from 'xiaoye-ui/locale/en_US';
import zhCN from 'xiaoye-ui/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('en');

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'filter1',
        value: 'filter1',
      },
    ],
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
];

const visible = ref(false);
const locale = ref(enUS.locale);
watch(locale, val => {
  dayjs.locale(val);
});
const info = () => {
  Modal.info({
    title: 'some info',
    content: 'some info',
  });
};
const confirm = () => {
  Modal.confirm({
    title: 'some info',
    content: 'some info',
  });
};

const formModel = ref({
  username: '',
  age: '100',
});

const { token } = theme.useToken();

const fileList: UploadFile[] = [
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    percent: 50,
    name: 'image.png',
    status: 'uploading',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-3',
    name: 'image.png',
    status: 'error',
  },
];

const ref1 = ref(null);
const ref2 = ref(null);
const ref3 = ref(null);
const current = ref(0);
const tourOpen = ref(false);
const steps: TourProps['steps'] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    target: () => ref1.value && ref1.value.$el,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: () => ref2.value && ref2.value.$el,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: () => ref3.value && ref3.value.$el,
  },
];
</script>
