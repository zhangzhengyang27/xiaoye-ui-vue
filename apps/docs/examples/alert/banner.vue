<template>
  <a-space direction="vertical" style="width: 100%">
    <a-alert message="Warning text" banner />
    <a-alert
      message="Very long warning text warning text text text text text text text"
      banner
      closable
    />
    <a-alert :show-icon="false" message="Warning text without icon" banner />
    <a-alert type="error" message="Error text" banner />
  </a-space>
</template>
