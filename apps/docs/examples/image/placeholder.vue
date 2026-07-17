<template>
  <xy-space :size="12">
    <xy-image
      :width="200"
      :src="`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`"
    >
      <template #placeholder>
        <xy-image
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
          :width="200"
          :preview="false"
        />
      </template>
    </xy-image>
    <xy-button type="primary" @click="random = Date.now()">reload</xy-button>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const random = ref();
</script>
