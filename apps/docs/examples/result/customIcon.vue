<template>
  <xy-result title="Great, we have done all the operations!">
    <template #icon>
      <smile-twoTone />
    </template>
    <template #extra>
      <xy-button type="primary">Next</xy-button>
    </template>
  </xy-result>
</template>
<script lang="ts" setup>
import { SmileTwoTone } from '@xiaoye-ui/icons';
</script>
