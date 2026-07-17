<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-alert message="Success Text" type="success">
      <template #description>
        <p>
          Success Description
          <span style="color: red">Success</span>
          Description Success Description
        </p>
      </template>
    </xy-alert>
    <xy-alert
      message="Info Text"
      description="Info Description Info Description Info Description Info Description"
      type="info"
    />
    <xy-alert
      message="Warning Text"
      description="Warning Description Warning Description Warning Description Warning Description"
      type="warning"
    />
    <xy-alert
      message="Error Text"
      description="Error Description Error Description Error Description Error Description"
      type="error"
    />
  </xy-space>
</template>
