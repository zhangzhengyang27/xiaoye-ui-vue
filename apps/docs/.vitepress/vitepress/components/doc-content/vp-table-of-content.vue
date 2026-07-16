<script setup lang="ts">
import { computed } from 'vue'
import { useToc } from '../../composables/use-toc'

const headers = useToc()
const removeTag = (str: string) => str.replace(/<span.*<\/span>/g, '')

// 转换为 Anchor 的 items API 格式
const anchorItems = computed(() => {
  return headers.value.map(({ link, text, children }) => ({
    key: link,
    href: link,
    title: removeTag(text),
    children: children?.map(({ link: childLink, text: childText }) => ({
      key: childLink,
      href: childLink,
      title: removeTag(childText),
    })),
  }))
})
</script>

<template>
  <aside ref="container" class="toc-wrapper">
    <nav class="toc-content">
      <h3 class="toc-content__heading">本页目录</h3>
      <a-anchor :items="anchorItems" :offset="70" :bound="120" />
    </nav>
    <div class="toc-content-mask" />
  </aside>
</template>

<style scoped lang="scss">
</style>
