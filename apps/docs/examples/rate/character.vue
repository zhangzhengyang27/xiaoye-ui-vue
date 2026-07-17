<template>
  <div>
    <xy-rate v-model:value="value1" allow-half>
      <template #character>
        <heart-outlined />
      </template>
    </xy-rate>
    <br />
    <xy-rate v-model:value="value2" character="A" allow-half style="font-size: 36px" />
    <br />
    <xy-rate v-model:value="value3" character="好" allow-half />
    <br />
  </div>
</template>
<script lang="ts" setup>
import { HeartOutlined } from '@xiaoye-ui/icons';
import { ref } from 'vue';
const value1 = ref<number>(2);
const value2 = ref<number>(2.5);
const value3 = ref<number>(0.5);
</script>
