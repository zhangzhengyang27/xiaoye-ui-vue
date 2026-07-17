<template>
  <xy-upload
    v-model:file-list="fileList"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <xy-button>
      <upload-outlined></upload-outlined>
      Upload png only
    </xy-button>
  </xy-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UploadOutlined } from '@xiaoye-ui/icons';
import type { UploadChangeParam, UploadProps } from 'xiaoye-ui';
import message from 'xiaoye-ui/message';
import { Upload } from 'xiaoye-ui';
const fileList = ref<UploadProps['fileList']>([
  {
    uid: '1',
    name: 'xxx.png',
    status: 'done',
    response: 'Server Error 500', // custom error message to show
    url: 'http://www.baidu.com/xxx.png',
  },
  {
    uid: '2',
    name: 'yyy.png',
    status: 'done',
    url: 'http://www.baidu.com/yyy.png',
  },
  {
    uid: '3',
    name: 'zzz.png',
    status: 'error',
    response: 'Server Error 500', // custom error message to show
    url: 'http://www.baidu.com/zzz.png',
  },
]);

const handleChange = ({ file, fileList }: UploadChangeParam) => {
  if (file.status !== 'uploading') {
    console.log(file, fileList);
  }
};
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const isPNG = file.type === 'image/png';
  if (!isPNG) {
    message.error(`${file.name} is not a png file`);
  }
  return isPNG || Upload.LIST_IGNORE;
};
</script>
