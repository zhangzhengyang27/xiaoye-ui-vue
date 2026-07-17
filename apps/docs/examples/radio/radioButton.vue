<template>
  <div>
    <div>
      <xy-radio-group v-model:value="value1">
        <xy-radio-button value="a">Hangzhou</xy-radio-button>
        <xy-radio-button value="b">Shanghai</xy-radio-button>
        <xy-radio-button value="c">Beijing</xy-radio-button>
        <xy-radio-button value="d">Chengdu</xy-radio-button>
      </xy-radio-group>
    </div>
    <div :style="{ marginTop: '16px' }">
      <xy-radio-group v-model:value="value2">
        <xy-radio-button value="a">Hangzhou</xy-radio-button>
        <xy-radio-button value="b" disabled>Shanghai</xy-radio-button>
        <xy-radio-button value="c">Beijing</xy-radio-button>
        <xy-radio-button value="d">Chengdu</xy-radio-button>
      </xy-radio-group>
    </div>
    <div :style="{ marginTop: '16px' }">
      <xy-radio-group v-model:value="value3" disabled>
        <xy-radio-button value="a">Hangzhou</xy-radio-button>
        <xy-radio-button value="b">Shanghai</xy-radio-button>
        <xy-radio-button value="c">Beijing</xy-radio-button>
        <xy-radio-button value="d">Chengdu</xy-radio-button>
      </xy-radio-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const value1 = ref<string>('a');
const value2 = ref<string>('a');
const value3 = ref<string>('a');
</script>
