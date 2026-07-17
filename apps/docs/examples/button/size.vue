<template>
  <xy-space direction="vertical">
    <xy-radio-group v-model:value="size">
      <xy-radio-button value="large">Large</xy-radio-button>
      <xy-radio-button value="default">Default</xy-radio-button>
      <xy-radio-button value="small">Small</xy-radio-button>
    </xy-radio-group>
    <xy-space>
      <xy-button type="primary" :size="size">Primary</xy-button>
      <xy-button :size="size">Normal</xy-button>
      <xy-button type="dashed" :size="size">Dashed</xy-button>
      <xy-button danger :size="size">Danger</xy-button>
      <xy-button type="link" :size="size">Link</xy-button>
    </xy-space>
    <xy-space>
      <xy-button type="primary" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
      </xy-button>
      <xy-button type="primary" shape="circle" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
      </xy-button>
      <xy-button type="primary" shape="round" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
        Download
      </xy-button>
      <xy-button type="primary" shape="round" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
      </xy-button>
      <xy-button type="primary" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
        Download
      </xy-button>
    </xy-space>
  </xy-space>
</template>
<script lang="ts" setup>
import { DownloadOutlined } from '@xiaoye-ui/icons';
import type { SizeType } from 'xiaoye-ui/config-provider';
import { ref } from 'vue';
const size = ref<SizeType>('large');
</script>
