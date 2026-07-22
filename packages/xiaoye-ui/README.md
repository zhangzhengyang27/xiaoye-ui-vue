# Xiaoye UI

企业级 UI 设计语言和 Vue 3 实现。

## 特性

- 🎨 企业级中后台产品的交互语言和视觉风格
- 📦 开箱即用的高质量 Vue 3 组件（80+ 组件）
- 🌍 国际化支持
- 🎯 TypeScript 完整类型支持
- 🌙 暗黑模式
- ⚡ 基于 Vite 构建，支持 Tree Shaking
- 🖥 支持 SSR / Electron

## 支持环境

- Vue >= 3.4.0
- 现代浏览器
- 支持服务端渲染
- [Electron](https://electronjs.org/)

## 安装

```bash
npm install xiaoye-ui
```

或

```bash
yarn add xiaoye-ui
```

或

```bash
pnpm add xiaoye-ui
```

## 快速开始

```vue
<template>
  <XyButton type="primary">Hello Xiaoye UI</XyButton>
</template>

<script setup>
import { Button as XyButton } from 'xiaoye-ui';
import 'xiaoye-ui/es/button/style';
</script>
```

### 全量引入

```js
import { createApp } from 'vue';
import XiaoyeUI from 'xiaoye-ui';
import App from './App.vue';

const app = createApp(App);
app.use(XiaoyeUI);
app.mount('#app');
```

### 按需引入

配合 `@xiaoye-ui/vite-plugin` 实现自动按需导入：

```js
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import XiaoyeUIResolver from '@xiaoye-ui/vite-plugin';

export default defineConfig({
  plugins: [vue(), XiaoyeUIResolver({ importStyle: true })],
});
```

然后在组件中直接使用，无需手动 import：

```vue
<template>
  <XyButton type="primary">Button</XyButton>
</template>
```

## 国际化

```js
import zhCN from 'xiaoye-ui/es/locale/zh_CN';
import { ConfigProvider } from 'xiaoye-ui';
```

```vue
<template>
  <ConfigProvider :locale="zhCN">
    <App />
  </ConfigProvider>
</template>
```

## 主题定制

```js
import { ConfigProvider } from 'xiaoye-ui';
```

```vue
<template>
  <ConfigProvider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <App />
  </ConfigProvider>
</template>
```

## 链接

- [文档站点](https://xiaoye-ui.github.io/)
- [GitHub](https://github.com/xiaoye-ui/xiaoye-ui)
- [更新日志](https://github.com/xiaoye-ui/xiaoye-ui/blob/master/CHANGELOG.md)

## 许可证

[MIT](https://github.com/xiaoye-ui/xiaoye-ui/blob/master/LICENSE)
