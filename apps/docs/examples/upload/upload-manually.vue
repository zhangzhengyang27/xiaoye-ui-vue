<template>
  <div class="clearfix">
    <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
      <a-button>
        <upload-outlined></upload-outlined>
        Select File
      </a-button>
    </a-upload>
    <a-button
      type="primary"
      :disabled="fileList.length === 0"
      :loading="uploading"
      style="margin-top: 16px"
      @click="handleUpload"
    >
      {{ uploading ? 'Uploading' : 'Start Upload' }}
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UploadOutlined } from '@xiaoye-ui/icons';
import message from 'xiaoye-ui/message';
import type { UploadProps } from 'xiaoye-ui';

const fileList = ref<UploadProps['fileList']>([]);
const uploading = ref<boolean>(false);

const handleRemove: UploadProps['onRemove'] = file => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [...(fileList.value || []), file];
  return false;
};

const handleUpload = () => {
  const formData = new FormData();
  fileList.value.forEach((file: UploadProps['fileList'][number]) => {
    formData.append('files[]', file as any);
  });
  uploading.value = true;

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: formData,
  })
    .then(() => {
      fileList.value = [];
      uploading.value = false;
      message.success('upload successfully.');
    })
    .catch(() => {
      uploading.value = false;
      message.error('upload failed.');
    });
};
</script>
