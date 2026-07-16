<template>
  <div>
    <a-pagination
      v-model:current="current1"
      v-model:page-size="pageSize1"
      :total="85"
      :show-total="total => `Total ${total} items`"
    />
    <br />
    <a-pagination
      v-model:current="current2"
      v-model:page-size="pageSize2"
      :total="85"
      :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current1 = ref<number>(1);
const current2 = ref<number>(2);
const pageSize1 = ref<number>(20);
const pageSize2 = ref<number>(20);
</script>
