<template>
  <a-space>
    <a-qrcode value="http://www.xiaoye-ui.github.io" status="loading" />
    <a-qrcode
      value="http://www.xiaoye-ui.github.io"
      status="expired"
      @refresh="() => console.log('refresh')"
    />
    <a-qrcode value="http://www.xiaoye-ui.github.io" status="scanned" />
  </a-space>
</template>
