<template>
  <xy-image
    :preview="{ visible: false }"
    :width="200"
    src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
    @click="visible = true"
  />
  <div style="display: none">
    <xy-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
      <xy-image
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
      />
      <xy-image
        src="https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp"
      />
      <xy-image
        src="https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp"
      />
    </xy-image-preview-group>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const visible = ref(false);
</script>
