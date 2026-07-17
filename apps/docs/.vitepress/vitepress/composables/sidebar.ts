import { computed } from 'vue';
import { useData, useRoute } from 'vitepress';
import { ensureStartingSlash } from '../utils';

export const useSidebar = () => {
  const route = useRoute();
  const { site, page } = useData();
  if (!page.value) {
    return {
      sidebars: computed(() => []),
      hasSidebar: computed(() => false),
    };
  }
  const sidebars = computed(() => {
    if (page.value.frontmatter.sidebar === false) return [];
    // VitePress 默认字段是 themeConfig.sidebar（不带 s）
    const sidebarConfig = (site.value.themeConfig as any).sidebar;
    const sidebars = getSidebarConfig(sidebarConfig, route.data.relativePath);
    return sidebars;
  });

  return {
    sidebars,
    hasSidebar: computed(() => sidebars.value.length > 0),
  };
};

export function isSideBarConfig(sidebar) {
  return sidebar === false || sidebar === 'auto' || Array.isArray(sidebar);
}
export function isSideBarGroup(item) {
  return item.children !== undefined || item.items !== undefined;
}
export function isSideBarEmpty(sidebar) {
  return Array.isArray(sidebar) ? sidebar.length === 0 : !sidebar;
}

type SidebarItem = {
  text: string;
  link: string;
};

type SidebarConfig = SidebarItem[];

type Sidebar =
  | {
      [key: string]: SidebarConfig;
    }
  | false
  | 'auto';

// 简化版：sidebar 是对象形式 { '/components/': [...], '/guide/': [...] }
// 不再依赖多语言结构 sidebar[dir][lang]，直接返回 sidebar[dir]
export function getSidebarConfig(sidebar: any, path: string) {
  if (sidebar === false || sidebar === 'auto') {
    return [];
  }
  // 如果 sidebar 已经是数组，直接返回
  if (Array.isArray(sidebar)) {
    return sidebar;
  }
  if (!sidebar || typeof sidebar !== 'object') {
    return [];
  }

  path = ensureStartingSlash(path);
  // 找到路径匹配的最长前缀
  let bestMatch: string | null = null;
  for (const dir in sidebar) {
    if (path.startsWith(ensureStartingSlash(dir))) {
      if (!bestMatch || dir.length > bestMatch.length) {
        bestMatch = dir;
      }
    }
  }
  if (bestMatch) {
    const result = sidebar[bestMatch];
    return Array.isArray(result) ? result : [];
  }
  return [];
}

export function getFlatSideBarLinks(sidebar) {
  if (!Array.isArray(sidebar)) return [];
  return sidebar.reduce((links, item) => {
    if (item.link) {
      links.push({ text: item.text, link: item.link });
    }
    if (isSideBarGroup(item)) {
      const children = item.children || item.items || [];
      links = [...links, ...getFlatSideBarLinks(children)];
    }
    return links;
  }, []);
}
