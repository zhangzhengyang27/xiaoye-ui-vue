<template>
  <xy-space>
    <xy-popover placement="topLeft">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <template #title>
        <span>Title</span>
      </template>
      <xy-button>Align edge / 边缘对齐</xy-button>
    </xy-popover>
    <xy-popover placement="topLeft" arrow-point-at-center>
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <template #title>
        <span>Title</span>
      </template>
      <xy-button>Arrow points to center / 箭头指向中心</xy-button>
    </xy-popover>
  </xy-space>
</template>
