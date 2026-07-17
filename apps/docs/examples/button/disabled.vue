<template>
  <xy-space direction="vertical">
    <xy-space>
      <xy-button type="primary">Primary</xy-button>
      <xy-button type="primary" disabled>Primary(disabled)</xy-button>
    </xy-space>
    <xy-space>
      <xy-button>Default</xy-button>
      <xy-button disabled>Default(disabled)</xy-button>
    </xy-space>
    <xy-space>
      <xy-button type="dashed">Dashed</xy-button>
      <xy-button type="dashed" disabled>Dashed(disabled)</xy-button>
    </xy-space>
    <xy-space>
      <xy-button type="text">Text</xy-button>
      <xy-button type="text" disabled>Text(disabled)</xy-button>
    </xy-space>
    <xy-space>
      <xy-button type="link">Link</xy-button>
      <xy-button type="link" disabled>Link(disabled)</xy-button>
    </xy-space>
    <xy-space>
      <xy-button danger>Danger Default</xy-button>
      <xy-button danger disabled>Danger Default(disabled)</xy-button>
    </xy-space>
    <xy-space>
      <xy-button danger type="text">Danger Text</xy-button>
      <xy-button danger type="text" disabled>Danger Text(disabled)</xy-button>
    </xy-space>
    <xy-space>
      <xy-button danger type="link">Danger Link</xy-button>
      <xy-button danger type="link" disabled>Danger Link(disabled)</xy-button>
    </xy-space>
    <div :style="{ padding: '8px', background: 'rgb(190, 200, 200)' }">
      <xy-space>
        <xy-button ghost>Ghost</xy-button>
        <xy-button ghost disabled>Ghost(disabled)</xy-button>
      </xy-space>
    </div>
  </xy-space>
</template>
