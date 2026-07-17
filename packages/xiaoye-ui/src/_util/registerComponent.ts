import type { App, Component } from 'vue';

/**
 * 将 XYButton 形式的组件名转换为 xy-button 形式的标签名
 */
export const toXYTagName = (name: string): string => {
  return name
    .replace(/^XY/, 'xy-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
};

/**
 * 注册单个组件，自动根据组件 name 生成 xy-xxx 标签名
 */
export const registerComponent = (app: App, component: Component, customName?: string): App => {
  const comp = component as any;
  const name = customName || comp.displayName || comp.name;
  if (!name) {
    return app;
  }
  const tagName = toXYTagName(name);
  if (!app.component(tagName)) {
    app.component(tagName, component);
  }
  return app;
};

/**
 * 批量注册组件
 */
export const registerComponents = (app: App, components: Component[]): App => {
  components.forEach(component => registerComponent(app, component));
  return app;
};
