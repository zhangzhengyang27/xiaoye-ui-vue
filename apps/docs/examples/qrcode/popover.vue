<template>
  <a-popover :overlay-inner-style="{ padding: 0 }">
    <template #content>
      <a-qrcode value="http://www.xiaoye-ui.github.io" :bordered="false" />
    </template>
    <img width="100" height="100" src="https://www.xiaoye-ui.github.io/logo.png" />
  </a-popover>
</template>
