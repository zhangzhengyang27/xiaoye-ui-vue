import { computed } from 'vue'
import { useData } from 'vitepress'

export const useNav = () => {
  const { theme } = useData()

  return computed(() => {
    // VitePress 默认 nav 是数组，直接返回
    return theme.value.nav || []
  })
}
