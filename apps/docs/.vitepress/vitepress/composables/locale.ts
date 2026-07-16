import { computed } from 'vue'

export const useLocale = (
  localeJson: Record<string, Record<string, string>>
) => {
  return computed(() => localeJson['zh-CN'])
}
