<template>
  <a-time-picker :value="dayjs('12:08:23', 'HH:mm:ss')" disabled />
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
</script>
