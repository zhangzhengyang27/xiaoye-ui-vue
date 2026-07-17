<template>
  <xy-upload-dragger
    v-model:file-list="fileList"
    name="file"
    :multiple="true"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    @change="handleChange"
    @drop="handleDrop"
  >
    <p class="xy-upload-drag-icon">
      <inbox-outlined></inbox-outlined>
    </p>
    <p class="xy-upload-text">Click or drag file to this area to upload</p>
    <p class="xy-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
  </xy-upload-dragger>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { InboxOutlined } from '@xiaoye-ui/icons';
import message from 'xiaoye-ui/message';
import type { UploadChangeParam } from 'xiaoye-ui';
const fileList = ref([]);
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};
function handleDrop(e: DragEvent) {
  console.log(e);
}
</script>
