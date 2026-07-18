<template>
  <div :style="{ height: '200vh', padding: '10px' }">
    <p>向下滚动页面，滚动超过 100px 即出现回到顶部按钮。</p>
    <xy-back-top :visibility-height="100" />
  </div>
</template>
