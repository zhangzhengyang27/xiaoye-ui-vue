<template>
  <xy-space direction="vertical" style="width: 100%" :size="16">
    <xy-skeleton :loading="loading">
      <div>
        <h4>Xiaoye UI, a design language</h4>
        <p>
          We supply a series of design principles, practical patterns and high quality design
          resources (Sketch and Axure), to help people create their product prototypes beautifully
          and efficiently.
        </p>
      </div>
    </xy-skeleton>
    <xy-button :disabled="loading" @click="showSkeleton">Show Skeleton</xy-button>
  </xy-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const loading = ref<boolean>(false);

const showSkeleton = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};
</script>
