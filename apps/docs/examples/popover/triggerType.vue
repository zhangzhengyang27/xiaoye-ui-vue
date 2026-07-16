<template>
  <div>
    <a-popover title="Title" trigger="hover">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button>Hover me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="focus">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button>Focus me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="click">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button>Click me</a-button>
    </a-popover>
  </div>
</template>
<style scoped>
#components-popover-demo-triggerType .xy-btn {
  margin-right: 8px;
}
</style>
