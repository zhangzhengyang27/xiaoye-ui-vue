<template>
  <xy-float-button-group shape="circle" :style="{ right: '24px' }">
    <xy-float-button>
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </xy-float-button>
    <xy-float-button />
    <xy-back-top :visibility-height="0" />
  </xy-float-button-group>
  <xy-float-button-group shape="square" :style="{ right: '94px' }">
    <xy-float-button>
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </xy-float-button>
    <xy-float-button />

    <xy-float-button>
      <template #icon>
        <SyncOutlined />
      </template>
    </xy-float-button>
    <xy-back-top :visibility-height="0" />
  </xy-float-button-group>
</template>

<script lang="ts" setup>
import { QuestionCircleOutlined, SyncOutlined } from '@xiaoye-ui/icons';
</script>
