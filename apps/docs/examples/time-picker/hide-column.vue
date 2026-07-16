<template>
  <a-time-picker v-model:value="value" format="HH:mm" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
const value = ref(dayjs('12:08', 'HH:mm'));
</script>
