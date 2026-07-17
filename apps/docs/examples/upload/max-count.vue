<template>
  <xy-space direction="vertical" style="width: 100%" size="large">
    <xy-upload
      v-model:file-list="fileList"
      list-type="picture"
      :max-count="1"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    >
      <xy-button>
        <upload-outlined></upload-outlined>
        Upload (Max: 1)
      </xy-button>
    </xy-upload>
    <xy-upload
      v-model:file-list="fileList2"
      list-type="picture"
      :max-count="3"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    >
      <xy-button>
        <upload-outlined></upload-outlined>
        Upload (Max: 3)
      </xy-button>
    </xy-upload>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UploadOutlined } from '@xiaoye-ui/icons';
import type { UploadProps } from 'xiaoye-ui';
const fileList = ref<UploadProps['fileList']>([]);
const fileList2 = ref<UploadProps['fileList']>([]);
</script>
