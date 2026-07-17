<template>
  <div id="components-a-tooltip-demo-placement">
    <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
      <xy-tooltip placement="topLeft">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>TL</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="top">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>Top</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="topRight">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>TR</xy-button>
      </xy-tooltip>
    </div>
    <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
      <xy-tooltip placement="leftTop">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>LT</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="left">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>Left</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="leftBottom">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>LB</xy-button>
      </xy-tooltip>
    </div>
    <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24}px` }">
      <xy-tooltip placement="rightTop">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>RT</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="right">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>Right</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="rightBottom">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>RB</xy-button>
      </xy-tooltip>
    </div>
    <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
      <xy-tooltip placement="bottomLeft">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>BL</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="bottom">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>Bottom</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="bottomRight">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>BR</xy-button>
      </xy-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
const buttonWidth = 70;
</script>
<style scoped>
:deep(#components-a-tooltip-demo-placement) .xy-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
