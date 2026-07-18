<template>
  <div :style="{ height: '200vh', padding: '10px' }">
    <p>向下滚动页面查看自定义内容的回到顶部按钮。</p>
    <xy-back-top :visibility-height="100">
      <div
        :style="{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
        }"
      >
        UP
      </div>
    </xy-back-top>
  </div>
</template>
