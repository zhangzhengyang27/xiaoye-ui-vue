<template>
  <a-space>
    <a-qrcode value="http://www.xiaoye-ui.github.io" :color="token.colorSuccessText" />
    <a-qrcode
      value="http://www.xiaoye-ui.github.io"
      :color="token.colorInfoText"
      :bg-color="token.colorBgLayout"
    />
  </a-space>
</template>

<script lang="ts" setup>
import { theme } from 'xiaoye-ui';

const { useToken } = theme;
const { token } = useToken();
</script>
