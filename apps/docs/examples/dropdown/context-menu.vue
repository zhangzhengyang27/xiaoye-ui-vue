<template>
  <xy-dropdown :trigger="['contextmenu']">
    <div
      :style="{
        textAlign: 'center',
        background: '#f7f7f7',
        height: '200px',
        lineHeight: '200px',
        color: '#777',
      }"
    >
      Right Click on here
    </div>
    <template #overlay>
      <xy-menu>
        <xy-menu-item key="1">1st menu item</xy-menu-item>
        <xy-menu-item key="2">2nd menu item</xy-menu-item>
        <xy-menu-item key="3">3rd menu item</xy-menu-item>
      </xy-menu>
    </template>
  </xy-dropdown>
</template>
