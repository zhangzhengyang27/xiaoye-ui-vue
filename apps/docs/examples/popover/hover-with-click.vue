<template>
  <xy-popover
    style="width: 500px"
    title="Hover title"
    trigger="hover"
    :open="hovered"
    @openChange="handleHoverChange"
  >
    <template #content>
      <div>This is hover content.</div>
    </template>
    <xy-popover title="Click title" trigger="click" :open="clicked" @openChange="handleClickChange">
      <template #content>
        <div>
          <div>This is click content.</div>
          <a @click="hide">Close</a>
        </div>
      </template>
      <xy-button>Hover and click / 悬停并单击</xy-button>
    </xy-popover>
  </xy-popover>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const clicked = ref<boolean>(false);
const hovered = ref<boolean>(false);

const hide = () => {
  clicked.value = false;
  hovered.value = false;
};

const handleHoverChange = (visible: boolean) => {
  clicked.value = false;
  hovered.value = visible;
};

const handleClickChange = (visible: boolean) => {
  clicked.value = visible;
  hovered.value = false;
};
</script>
