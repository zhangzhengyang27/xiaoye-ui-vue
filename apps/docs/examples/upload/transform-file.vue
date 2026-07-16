<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      :before-upload="beforeUpload"
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
import { UploadOutlined } from '@xiaoye-ui/icons';
import type { UploadProps } from 'xiaoye-ui';

const beforeUpload: UploadProps['beforeUpload'] = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img: HTMLImageElement = document.createElement('img');
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = 'red';
        ctx.textBaseline = 'middle';
        ctx.font = '33px Arial';
        ctx.fillText('Xiaoye UI', 20, 20);
        canvas.toBlob(resolve);
      };
    };
  });
};

const fileList = ref<UploadProps['fileList']>([]);
</script>
