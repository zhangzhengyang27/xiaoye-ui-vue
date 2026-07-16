<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      list-type="picture"
      action="//jsonplaceholder.typicode.com/posts/"
      :preview-file="previewFile"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Upload
      </a-button>
    </a-upload>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'xiaoye-ui';

const previewFile: UploadProps['previewFile'] = async file => {
  console.log('Your upload file:', file);
  // Your process logic. Here we just mock to the same file
  const res = await fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
    method: 'POST',
    body: file,
  });
  const { thumbnail } = await res.json();
  return thumbnail;
};
const fileList = ref([]);
</script>
