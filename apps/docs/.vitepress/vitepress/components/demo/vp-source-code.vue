<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  source: string
}>()

const decoded = computed(() => {
  return decodeURIComponent(props.source)
})
</script>

<template>
  <div v-show="visible" class="example-source-wrapper">
    <div class="example-source" v-html="decoded" />
  </div>
</template>

<style scoped>
.example-source-wrapper {
  border-top: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
}

.example-source {
  max-height: 500px;
  overflow: auto;
}

.example-source :deep(.language-vue) {
  margin: 0 !important;
  border-radius: 0 !important;
  background-color: var(--vp-c-bg-alt) !important;
}
</style>
