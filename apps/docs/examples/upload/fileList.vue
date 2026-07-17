<template>
  <xy-upload
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    :multiple="true"
    :file-list="fileList"
    @change="handleChange"
  >
    <xy-button>
      <upload-outlined></upload-outlined>
      Upload
    </xy-button>
  </xy-upload>
</template>
<script lang="ts" setup>
import { UploadOutlined } from '@xiaoye-ui/icons';
import { ref } from 'vue';
import type { UploadChangeParam, UploadProps } from 'xiaoye-ui';
const fileList = ref<UploadProps['fileList']>([
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'http://www.baidu.com/xxx.png',
  },
]);
const handleChange = (info: UploadChangeParam) => {
  let resFileList = [...info.fileList];

  // 1. Limit the number of uploaded files
  //    Only to show two recent uploaded files, and old ones will be replaced by the new
  resFileList = resFileList.slice(-2);

  // 2. read from response and show file link
  resFileList = resFileList.map(file => {
    if (file.response) {
      // Component will show file.url as link
      file.url = file.response.url;
    }
    return file;
  });

  fileList.value = resFileList;
};
</script>
