<script setup lang="ts">
import { ref, watch } from 'vue'
import { isDark, toggleDark } from '../../composables/dark'
import DarkIcon from '../icons/dark.vue'
import LightIcon from '../icons/light.vue'

defineOptions({ inheritAttrs: false })

const darkMode = ref(isDark.value)

watch(
  () => isDark.value,
  (newVal) => {
    darkMode.value = newVal
  }
)

watch(
  () => darkMode.value,
  (newVal) => {
    if (newVal !== isDark.value) {
      toggleDark()
    }
  }
)
</script>

<template>
  <ClientOnly>
    <a-switch
      v-model:checked="darkMode"
      v-bind="$attrs"
    >
      <template #checkedChildren><DarkIcon /></template>
      <template #unCheckedChildren><LightIcon /></template>
    </a-switch>
  </ClientOnly>
</template>

<style lang="scss" scoped>
:deep(.ant-switch) {
  background-color: var(--bg-color-mute);
  border: 1px solid var(--border-color);

  .ant-switch-handle {
    width: 14px;
    height: 14px;
  }
}

:deep(.dark-icon) {
  border-radius: 50%;
  color: #cfd3dc;
  background-color: #141414;
}

:deep(.light-icon) {
  color: #606266;
}
</style>
