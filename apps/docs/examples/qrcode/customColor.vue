<template>
  <xy-space>
    <xy-qrcode value="http://www.xiaoye-ui.github.io" :color="token.colorSuccessText" />
    <xy-qrcode
      value="http://www.xiaoye-ui.github.io"
      :color="token.colorInfoText"
      :bg-color="token.colorBgLayout"
    />
  </xy-space>
</template>

<script lang="ts" setup>
import { theme } from 'xiaoye-ui';

const { useToken } = theme;
const { token } = useToken();
</script>
