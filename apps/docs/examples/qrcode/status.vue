<template>
  <xy-space>
    <xy-qrcode value="http://www.xiaoye-ui.github.io" status="loading" />
    <xy-qrcode
      value="http://www.xiaoye-ui.github.io"
      status="expired"
      @refresh="() => console.log('refresh')"
    />
    <xy-qrcode value="http://www.xiaoye-ui.github.io" status="scanned" />
  </xy-space>
</template>
