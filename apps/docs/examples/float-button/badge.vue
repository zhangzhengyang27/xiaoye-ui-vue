<template>
  <a-float-button shape="circle" :badge="{ dot: true }" :style="{ right: '164px' }" />
  <a-float-button-group shape="circle" :style="{ right: '94px' }">
    <a-float-button :badge="{ count: 5, color: 'blue' }">
      <template #tooltip>
        <div>custom badge color</div>
      </template>
    </a-float-button>
    <a-float-button :badge="{ count: 5 }"></a-float-button>
  </a-float-button-group>
  <a-float-button-group shape="circle">
    <a-float-button :badge="{ count: 12 }">
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>
    <a-float-button :badge="{ count: 123, overflowCount: 999 }"></a-float-button>
    <a-back-top :visibility-height="0" />
  </a-float-button-group>
</template>
<script setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
</script>
