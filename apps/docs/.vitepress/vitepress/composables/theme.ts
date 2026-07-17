import { computed } from 'vue';
import { isDark } from '../composables/dark';
import { theme } from 'xiaoye-ui';

const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = theme;

export function useThemeAlgorithm() {
  const algorithm = computed(() => {
    return isDark.value ? darkAlgorithm : defaultAlgorithm;
  });

  return {
    algorithm,
    isDark,
  };
}
