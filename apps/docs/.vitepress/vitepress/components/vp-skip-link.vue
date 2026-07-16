<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const anchorRef = ref()
const title = '跳转到主内容'

watch(
  () => route.path,
  () => anchorRef.value.focus()
)

const focusOnTargetAnchor = ({ target }: Event) => {
  const el = document.querySelector(
    (target as HTMLAnchorElement).hash!
  ) as HTMLAnchorElement

  if (el) {
    const removeTabIndex = () => {
      el.removeAttribute('tabindex')
      el.removeEventListener('blur', removeTabIndex)
    }
    el.setAttribute('tabindex', '-1')
    el.addEventListener('blur', removeTabIndex)
    el.focus()
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <span ref="anchorRef" tabindex="-1" />
  <a
    href="#page-content"
    class="skip-link visually-hidden"
    @click="focusOnTargetAnchor"
  >
    {{ title }}
  </a>
</template>

<style scoped lang="scss">
.skip-link {
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  z-index: 999;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  color: var(--text-color);
  background-color: var(--bg-color);
  border-radius: 4px;

  &:focus {
    height: auto;
    width: auto;
    clip: auto;
    clip-path: none;
  }
}
</style>
