# 安装

## 环境准备

在开始之前，请确保本地环境满足以下要求：

- [Node.js](https://nodejs.org/) >= 18.0.0
- [pnpm](https://pnpm.io/) >= 9.6.0

## 安装主包

XiaoyeUI 的主包名为 `xiaoye-ui`，包含了全部 UI 组件及其类型定义。

```bash
pnpm add xiaoye-ui
```

如果你使用 npm 或 yarn：

```bash
npm install xiaoye-ui
# 或
yarn add xiaoye-ui
```

## 引入方式

### 方式一：按需引入（推荐）

按需引入可以减小打包体积，只加载使用到的组件及其样式。

```typescript
import { XYButton } from 'xiaoye-ui';
import 'xiaoye-ui/button/style';
```

在 `<script setup>` 中直接使用：

```vue
<script setup lang="ts">
import { XYButton } from 'xiaoye-ui';
import 'xiaoye-ui/button/style';
</script>

<template>
  <xy-button type="primary">主要按钮</xy-button>
</template>
```

### 方式二：全量引入

适用于原型开发或小型项目，一次性引入所有组件。

```typescript
import { createApp } from 'vue';
import XiaoyeUI from 'xiaoye-ui';
import App from './App.vue';

const app = createApp(App);
app.use(XiaoyeUI);
app.mount('#app');
```

全量引入时，组件样式会自动按需加载，无需手动引入每个组件的样式文件。

### 方式三：自动导入

配合 `@xiaoye-ui/auto-import-resolver` 和 `unplugin-vue-components`，可以在模板中直接使用组件标签，无需手动 import。

#### Vite 项目

```bash
pnpm add -D unplugin-vue-components @xiaoye-ui/auto-import-resolver
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { XiaoyeUIResolver } from '@xiaoye-ui/auto-import-resolver';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        XiaoyeUIResolver({
          // 可选：自定义组件前缀，默认为 xy-
          // prefix: 'xy'
        }),
      ],
    }),
  ],
});
```

配置完成后即可在模板中直接使用：

```vue
<template>
  <xy-button type="primary">主要按钮</xy-button>
  <xy-input v-model="value" placeholder="请输入" />
</template>
```

## 图标使用

XiaoyeUI 的图标统一从 `@xiaoye-ui/icons` 命名导入：

```typescript
import { SearchOutlined, HomeOutlined } from '@xiaoye-ui/icons';
```

```vue
<template>
  <xy-button>
    <template #icon><search-outlined /></template>
    搜索
  </xy-button>
</template>
```

:::tip禁止从 `@ant-design/icons-vue` 或其子路径导入图标。所有图标组件均包裹在 `<span class="xyicon">` 中，以保证组件内图标布局正确。:::

## Nuxt 项目

XiaoyeUI 提供了官方 Nuxt 模块 `@xiaoye-ui/nuxt-module`。

```bash
pnpm add @xiaoye-ui/nuxt-module
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@xiaoye-ui/nuxt-module'],
  xiaoyeUi: {
    // 自动导入组件
    autoImport: true,
    // 加载组件样式
    loadStyles: true,
  },
});
```

## TypeScript 支持

XiaoyeUI 使用 TypeScript 编写，默认提供完整的类型定义。如果你的项目使用 TypeScript，安装后无需额外配置即可获得类型提示。

```typescript
import type { ButtonProps } from 'xiaoye-ui';
```

## 主题配置

通过 `ConfigProvider` 可以全局配置主题 Token：

```vue
<script setup lang="ts">
import { ConfigProvider } from 'xiaoye-ui';
</script>

<template>
  <ConfigProvider
    :theme="{
      token: {
        colorPrimary: '#1890ff',
      },
    }"
  >
    <App />
  </ConfigProvider>
</template>
```

## 常见问题

### 组件没有样式

如果组件显示正常但没有样式，请检查是否引入了对应的样式文件：

```typescript
import 'xiaoye-ui/button/style';
```

全量引入时则无需单独引入样式。

### 图标显示异常

请确认图标从 `@xiaoye-ui/icons` 导入，且没有使用 `@ant-design/icons-vue` 的旧导入方式。

### 自动导入不生效

请检查 `vite.config.ts` 中是否正确配置了 `XiaoyeUIResolver`，并确认 `unplugin-vue-components` 已安装。

## 下一步

- [Button 组件](/components/button) — 从最常用的 Button 组件开始
- [ConfigProvider 全局配置](/components/config-provider) — 学习主题和全局配置
- [LLM / AI 使用](/guide/llm) — 了解如何在 AI 助手中使用 XiaoyeUI
