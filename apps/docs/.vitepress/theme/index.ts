import DefaultTheme from 'vitepress/theme';
import VPApp from '../vitepress/components/vp-app.vue';
import { globals } from '../vitepress';
import XiaoyeUI from 'xiaoye-ui';
import '../styles/tailwind.css';
import './custom.css';

// Example components: 基于 examples/ 目录自动注册 xy-<comp>-<demo>
// docs/.vitepress/plugins/demo.ts 使用 xy-<comp>-<demo> 格式来渲染组件
const exampleModules = import.meta.glob('/examples/**/!(*index).vue', { eager: true });

const exampleComponents = Object.fromEntries(
  Object.entries(exampleModules).map(([path, mod]) => {
    // path: /examples/<comp>/<demo>.vue -> demo-<comp>-<demo>
    const segments = path.split('/').filter(Boolean);
    const component = segments[1];
    const demoFile = segments[segments.length - 1].replace(/\.vue$/, '');
    const kebab = `demo-${component}-${demoFile}`;
    return [kebab, (mod as any).default];
  }),
);

export default {
  ...DefaultTheme,
  // 使用自定义 Layout 替代 VitePress 默认 Layout
  // 自定义 Layout 用 .doc-content 替代 .vp-doc，避免样式污染
  Layout: VPApp,
  enhanceApp({ app }) {
    app.use(XiaoyeUI);
    Object.entries(globals).forEach(([name, Comp]) => {
      app.component(name, Comp);
    });
    Object.entries(exampleComponents).forEach(([name, Comp]) => {
      app.component(name, Comp);
    });
  },
};
