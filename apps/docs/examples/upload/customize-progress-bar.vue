<template>
  <xy-upload
    v-model:file-list="fileList"
    name="file"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    :headers="headers"
    :progress="progress"
    @change="handleChange"
  >
    <xy-button>
      <upload-outlined></upload-outlined>
      Click to Upload
    </xy-button>
  </xy-upload>
</template>
<script lang="ts" setup>
import message from 'xiaoye-ui/message';
import { UploadOutlined } from '@xiaoye-ui/icons';
import { ref } from 'vue';
import type { UploadChangeParam, UploadProps } from 'xiaoye-ui';
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};

const fileList = ref([]);
const progress: UploadProps['progress'] = {
  strokeColor: {
    '0%': '#108ee9',
    '100%': '#87d068',
  },
  strokeWidth: 3,
  format: percent => `${parseFloat(percent.toFixed(2))}%`,
  class: 'test',
};
const headers = { authorization: 'authorization-text' };
</script>
