<template>
  <xy-card :style="cardStyle" :body-style="{ padding: 0, overflow: 'hidden' }">
    <xy-flex justify="space-between">
      <img
        alt="avatar"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        :style="imgStyle"
      />
      <xy-flex vertical align="flex-end" justify="space-between" :style="{ padding: '32px' }">
        <xy-typography>
          <xy-typography-title :level="3">
            “xiaoye-ui is an enterprise-class UI design language and Vue UI library.”
          </xy-typography-title>
        </xy-typography>
        <xy-button type="primary" href="https://xiaoye-ui.github.io" target="_blank">
          Get Start
        </xy-button>
      </xy-flex>
    </xy-flex>
  </xy-card>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
const cardStyle: CSSProperties = {
  width: '620px',
};
const imgStyle: CSSProperties = {
  display: 'block',
  width: '273px',
};
</script>
