<template>
  <xy-spin :spinning="spinning" :delay="delayTime">
    <xy-alert
      message="Alert message title"
      description="Further details about the context of this alert."
    ></xy-alert>
  </xy-spin>
  <div class="spin-state">
    Loading state：
    <xy-switch v-model:checked="spinning" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const spinning = ref<boolean>(false);
const delayTime = 500;
</script>
<style scoped>
.spin-state {
  margin-top: 16px;
}
</style>
