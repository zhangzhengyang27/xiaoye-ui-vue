<template>
  <div class="space-align-container">
    <div class="space-align-block">
      <xy-space align="center">
        center
        <xy-button type="primary">Primary</xy-button>
        <span class="mock-block">Block</span>
      </xy-space>
    </div>
    <div class="space-align-block">
      <xy-space align="start">
        start
        <xy-button type="primary">Primary</xy-button>
        <span class="mock-block">Block</span>
      </xy-space>
    </div>
    <div class="space-align-block">
      <xy-space align="end">
        end
        <xy-button type="primary">Primary</xy-button>
        <span class="mock-block">Block</span>
      </xy-space>
    </div>
    <div class="space-align-block">
      <xy-space align="baseline">
        baseline
        <xy-button type="primary">Primary</xy-button>
        <span class="mock-block">Block</span>
      </xy-space>
    </div>
  </div>
</template>
<style scoped>
.space-align-container {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}
.space-align-block {
  margin: 8px 4px;
  border: 1px solid #40a9ff;
  padding: 4px;
  flex: none;
}
.space-align-block .mock-block {
  display: inline-block;
  padding: 32px 8px 16px;
  background: rgba(150, 150, 150, 0.2);
}
</style>
