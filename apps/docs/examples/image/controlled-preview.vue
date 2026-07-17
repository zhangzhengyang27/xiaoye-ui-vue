<template>
  <div>
    <xy-button type="primary" @click="() => setVisible(true)">show image preview</xy-button>
    <xy-image
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        visible,
        onVisibleChange: setVisible,
      }"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const visible = ref<boolean>(false);
const setVisible = (value): void => {
  visible.value = value;
};
</script>
