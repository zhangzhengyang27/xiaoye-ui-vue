<template>
  <xy-qrcode ref="qrcodeCanvasRef" value="http://www.xiaoye-ui.github.io" />
  <br />
  <br />
  <xy-button type="primary" @click="dowloadChange">Downlaod</xy-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const qrcodeCanvasRef = ref();
const dowloadChange = async () => {
  const url = await qrcodeCanvasRef.value.toDataURL();
  const a = document.createElement('a');
  a.download = 'QRCode.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>
