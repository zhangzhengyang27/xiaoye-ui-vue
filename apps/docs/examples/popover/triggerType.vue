<template>
  <div>
    <xy-popover title="Title" trigger="hover">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <xy-button>Hover me</xy-button>
    </xy-popover>
    <xy-popover title="Title" trigger="focus">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <xy-button>Focus me</xy-button>
    </xy-popover>
    <xy-popover title="Title" trigger="click">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <xy-button>Click me</xy-button>
    </xy-popover>
  </div>
</template>
<style scoped>
#components-popover-demo-triggerType .xy-btn {
  margin-right: 8px;
}
</style>
