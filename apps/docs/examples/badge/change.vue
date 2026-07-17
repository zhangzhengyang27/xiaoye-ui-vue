<template>
  <div>
    <xy-badge :count="count">
      <xy-avatar shape="square" size="large" />
    </xy-badge>
    <xy-button-group>
      <xy-button @click="decline">
        <minus-outlined />
      </xy-button>
      <xy-button @click="increase">
        <plus-outlined />
      </xy-button>
    </xy-button-group>
  </div>
  <xy-divider />
  <xy-badge :dot="show">
    <xy-avatar shape="square" size="large" />
  </xy-badge>
  <xy-switch v-model:checked="show" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { MinusOutlined, PlusOutlined } from '@xiaoye-ui/icons';
const count = ref<number>(5);
const show = ref<boolean>(true);
const decline = () => {
  if (count.value >= 1) {
    count.value--;
  }
};

const increase = () => {
  count.value++;
};
</script>
