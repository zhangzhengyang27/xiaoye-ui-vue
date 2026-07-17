<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-alert message="Warning text" banner />
    <xy-alert
      message="Very long warning text warning text text text text text text text"
      banner
      closable
    />
    <xy-alert :show-icon="false" message="Warning text without icon" banner />
    <xy-alert type="error" message="Error text" banner />
  </xy-space>
</template>
