import { computed } from 'vue';
import { useData } from 'vitepress';
import { isActive } from '../utils';
import { getFlatSideBarLinks, getSidebarConfig } from './sidebar';

export function usePageNav() {
  const { page, theme } = useData();

  const candidates = computed(() => {
    const sidebarConfig = (theme.value as any).sidebar;
    const config = getSidebarConfig(sidebarConfig, page.value.relativePath);
    // 确保是数组
    return Array.isArray(config) ? getFlatSideBarLinks(config) : [];
  });

  const index = computed(() => {
    return candidates.value.findIndex(item => {
      return isActive(page.value.relativePath, item.link);
    });
  });
  const next = computed(() => {
    if (
      theme.value.nextLinks !== false &&
      index.value > -1 &&
      index.value < candidates.value.length - 1
    ) {
      return candidates.value[index.value + 1];
    }

    return null;
  });

  const prev = computed(() => {
    if (theme.value.prevLinks !== false && index.value > 0) {
      return candidates.value[index.value - 1];
    }
    return null;
  });

  const hasLinks = computed(() => !!next.value || !!prev.value);
  return {
    next,
    prev,
    hasLinks,
  };
}
