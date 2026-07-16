<script setup lang="ts">
import { computed, ref } from 'vue'
import SourceCode from './demo/vp-source-code.vue'

const props = defineProps<{
  sources: [string, string]
  path: string
  rawSources: [string, string]
  description: string
}>()

const showSource = ref(false)
const isTS = ref(true)

const decodedDescription = computed(() => decodeURIComponent(props.description))
const decodedRawSource = computed(() => decodeURIComponent(props.rawSources[isTS.value ? 0 : 1]))
const source = computed(() => props.sources[isTS.value ? 0 : 1])

const toggleSource = () => {
  showSource.value = !showSource.value
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(decodedRawSource.value)
  } catch (e) {
    console.error('Copy failed', e)
  }
}

const demoSourceUrl = computed(() => {
  return `https://github.com/xiaoye-ui/xiaoye-ui/edit/main/docs/examples/${props.path}.vue`
})
</script>

<template>
  <div class="demo-description" v-html="decodedDescription" />

  <div class="example">
    <div class="example-showcase">
      <slot name="source" />
    </div>

    <div class="op-btns">
      <button
        :class="['lang-btn', { active: isTS }]"
        @click="isTS = true"
      >
        TS
      </button>
      <button
        :class="['lang-btn', { active: !isTS }]"
        @click="isTS = false"
      >
        JS
      </button>

      <a
        :href="demoSourceUrl"
        target="_blank"
        class="op-btn"
        title="Edit on GitHub"
      >
        <i class="i-ri-github-line" />
      </a>

      <button class="op-btn" title="Copy code" @click="copyCode">
        <i class="i-ri-file-copy-line" />
      </button>

      <button
        class="op-btn"
        :title="showSource ? 'Hide source' : 'View source'"
        @click="toggleSource"
      >
        <i class="i-ri-code-line" />
      </button>
    </div>

    <SourceCode :visible="showSource" :source="source" />

    <div
      v-show="showSource"
      class="source-control"
      @click="showSource = false"
    >
      <i class="i-ri-arrow-up-s-line" />
      <span>Hide source</span>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.demo-description {
  @apply my-4 text-sm;
}

.example {
  @apply border border-[var(--vp-c-divider)] rounded-lg overflow-hidden my-4;
}

.example-showcase {
  @apply p-6 bg-[var(--vp-c-bg-soft)];
}

.op-btns {
  @apply flex items-center justify-end gap-2 px-2 py-2 border-t border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)];
}

.lang-btn {
  @apply px-3 py-1 text-xs border border-[var(--vp-c-divider)] rounded bg-transparent text-[var(--vp-c-text-2)] cursor-pointer transition-all duration-200;
}

.lang-btn.active {
  @apply bg-[var(--vp-c-brand)] text-white border-[var(--vp-c-brand)];
}

.op-btn {
  @apply p-1 flex items-center justify-center bg-transparent border-none text-[var(--vp-c-text-2)] cursor-pointer transition-colors duration-200;
}

.op-btn :deep(i) {
  @apply w-4 h-4;
}

.op-btn:hover {
  @apply text-[var(--vp-c-text-1)];
}

.source-control {
  @apply flex items-center justify-center gap-2 px-3 py-3 border-t border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] text-[var(--vp-c-text-2)] cursor-pointer text-sm transition-colors duration-200;
}

.source-control :deep(i) {
  @apply w-4 h-4;
}

.source-control:hover {
  @apply text-[var(--vp-c-brand)];
}
</style>
