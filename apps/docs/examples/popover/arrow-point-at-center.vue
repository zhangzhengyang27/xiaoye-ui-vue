<template>
  <a-space>
    <a-popover placement="topLeft">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <template #title>
        <span>Title</span>
      </template>
      <a-button>Align edge / 边缘对齐</a-button>
    </a-popover>
    <a-popover placement="topLeft" arrow-point-at-center>
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <template #title>
        <span>Title</span>
      </template>
      <a-button>Arrow points to center / 箭头指向中心</a-button>
    </a-popover>
  </a-space>
</template>
