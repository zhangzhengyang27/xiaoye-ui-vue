<template>
  <xy-float-button
    tooltip="HELP INFO"
    :style="{
      right: '24px',
    }"
  ></xy-float-button>

  <xy-float-button
    :style="{
      right: '94px',
    }"
  >
    <template #tooltip>
      <div>Documents</div>
    </template>
  </xy-float-button>
</template>
