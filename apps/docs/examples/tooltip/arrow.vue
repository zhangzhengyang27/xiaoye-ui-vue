<template>
  <div id="components-a-tooltip-demo-arrow">
    <div style="margin-bottom: 24px">
      <xy-segmented v-model:value="arrow" :options="options" />
    </div>
    <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
      <xy-tooltip placement="topLeft" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>TL</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="top" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>Top</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="topRight" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>TR</xy-button>
      </xy-tooltip>
    </div>
    <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
      <xy-tooltip placement="leftTop" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>LT</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="left" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>Left</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="leftBottom" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>LB</xy-button>
      </xy-tooltip>
    </div>
    <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24}px` }">
      <xy-tooltip placement="rightTop" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>RT</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="right" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>Right</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="rightBottom" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>RB</xy-button>
      </xy-tooltip>
    </div>
    <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
      <xy-tooltip placement="bottomLeft" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>BL</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="bottom" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>Bottom</xy-button>
      </xy-tooltip>
      <xy-tooltip placement="bottomRight" :arrow="mergedArrow">
        <template #title>
          <span>prompt text</span>
        </template>
        <xy-button>BR</xy-button>
      </xy-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
const buttonWidth = 70;

const arrow = ref<string>('show');

const options = [
  {
    label: 'Show',
    value: 'show',
  },
  {
    label: 'Hide',
    value: 'hide',
  },
  {
    label: 'Center',
    value: 'center',
  },
];
const mergedArrow = computed(() => {
  switch (arrow.value) {
    case 'show':
      return true;
    case 'hide':
      return false;
    case 'center':
    default:
      return { pointAtCenter: true };
  }
});
</script>
<style scoped>
:deep(#components-a-tooltip-demo-arrow) .xy-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
