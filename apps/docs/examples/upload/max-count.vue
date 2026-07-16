<template>
  <a-space direction="vertical" style="width: 100%" size="large">
    <a-upload
      v-model:file-list="fileList"
      list-type="picture"
      :max-count="1"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Upload (Max: 1)
      </a-button>
    </a-upload>
    <a-upload
      v-model:file-list="fileList2"
      list-type="picture"
      :max-count="3"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Upload (Max: 3)
      </a-button>
    </a-upload>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'xiaoye-ui';
const fileList = ref<UploadProps['fileList']>([]);
const fileList2 = ref<UploadProps['fileList']>([]);
</script>
