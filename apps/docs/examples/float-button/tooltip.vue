<template>
  <a-float-button
    tooltip="HELP INFO"
    :style="{
      right: '24px',
    }"
  ></a-float-button>

  <a-float-button
    :style="{
      right: '94px',
    }"
  >
    <template #tooltip>
      <div>Documents</div>
    </template>
  </a-float-button>
</template>
