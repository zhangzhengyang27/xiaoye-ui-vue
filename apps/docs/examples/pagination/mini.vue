<template>
  <div id="components-pagination-demo-mini">
    <xy-pagination size="small" :total="50" />
    <xy-pagination size="small" :total="50" show-size-changer show-quick-jumper />
    <xy-pagination size="small" :total="50" :show-total="total => `Total ${total} items`" />
  </div>
</template>
<style scoped>
#components-pagination-demo-mini .xy-pagination:not(:last-child) {
  margin-bottom: 24px;
}
</style>
