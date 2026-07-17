import { computed } from 'vue';
import { useData } from 'vitepress';

export function useEditLink() {
  return {
    url: computed(() => ''),
    text: '在 GitHub 上编辑此页',
  };
}
