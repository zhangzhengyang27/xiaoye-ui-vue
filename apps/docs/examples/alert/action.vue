<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-alert message="Success Tips" type="success" show-icon closable>
      <template #action>
        <xy-button size="small" type="text">UNDO</xy-button>
      </template>
    </xy-alert>
    <xy-alert
      message="Error Text"
      show-icon
      description="Error Description Error Description Error Description Error Description"
      type="error"
    >
      <template #action>
        <xy-button size="small" danger>Detail</xy-button>
      </template>
    </xy-alert>
    <xy-alert message="Warning Text" type="warning" closable>
      <template #action>
        <xy-space>
          <xy-button size="small" type="ghost">Done</xy-button>
        </xy-space>
      </template>
    </xy-alert>
    <xy-alert
      message="Info Text"
      description="Info Description Info Description Info Description Info Description"
      type="info"
      closable
    >
      <template #action>
        <xy-space direction="vertical">
          <xy-button size="small" type="primary">Accept</xy-button>
          <xy-button size="small" danger type="ghost">Decline</xy-button>
        </xy-space>
      </template>
    </xy-alert>
  </xy-space>
</template>
