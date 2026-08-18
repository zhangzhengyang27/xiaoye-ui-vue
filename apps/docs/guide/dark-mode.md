# 暗黑模式

XiaoyeUI 的主题系统基于 **Design Token + 派生算法**（与 antd v5 同源）：`Seed Token → Map Token → Alias Token → Component Token`。组件样式全部由 Token 驱动，**没有硬编码颜色**——你在浏览器里看到的 `rgba(0, 0, 0, 0.88)` 是浅色种子 Token 的派生值，切换算法后会自动翻转为 `rgba(255, 255, 255, 0.85)`。

因此启用暗黑模式**不需要**覆盖任何组件样式，只需通过 `ConfigProvider` 切换派生算法。

## 页面级暗黑：ConfigProvider + darkAlgorithm

在应用根节点接入 `ConfigProvider`，将 `theme.algorithm` 设为 `darkAlgorithm`，必要时用 `token` 对齐品牌色：

```vue
<script setup lang="ts">
import { ConfigProvider, theme } from 'xiaoye-ui';
import { computed } from 'vue';

const isDark = ref(false); // 由你的主题状态（class / storage / 系统偏好）驱动

const themeConfig = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: '#0EA5E9',
    colorInfo: '#0EA5E9',
    colorSuccess: '#34C77B',
    colorWarning: '#F59E0B',
    colorError: '#F87171',
  },
}));
</script>

<template>
  <ConfigProvider :theme="themeConfig">
    <App />
  </ConfigProvider>
</template>
```

- 切换到暗色后，所有组件的 `css-dev-only-do-not-override-*` 样式 Hash 会**随算法重建**（同一组件浅色/暗色是两个 Hash），这是正常现象
- 组件文字、边框、背景、阴影等全部自动跟随，无需任何手动 CSS 覆盖
- 支持按组件的 Token 覆盖，例如 `components: { Button: { colorPrimary: '#8B5CF6' } }`

## 静态 API 的暗黑：ConfigProvider.config

`message` / `notification` / `modal.confirm` 等**静态调用**（不依赖组件实例）默认挂载在 `body` 下，无法从页面上的 `ConfigProvider` 继承主题。`ConfigProvider.config()` 支持传入完整的新式主题配置（`algorithm` / `token` / `components`），静态 API 将完全按照该主题渲染：

```typescript
import { ConfigProvider, theme } from 'xiaoye-ui';

ConfigProvider.config({
  theme: {
    algorithm: theme.darkAlgorithm,
    token: { colorPrimary: '#0EA5E9' },
  },
});

message.success('暗色 Toast');
notification.open({ message: '标题', description: '内容' });
```

### 响应式切换

`theme` 接受 `ref` / `computed`，主题变化时静态 API 的样式 Hash 会自动重建：

```typescript
import { ConfigProvider, theme } from 'xiaoye-ui';
import { ref } from 'vue';

const isDark = ref(true);

ConfigProvider.config({
  theme: computed(() => ({
    algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: { colorPrimary: '#0EA5E9' },
  })),
});

// isDark 变化后，message / notification / modal.confirm 即时跟随
```

### 旧版配置兼容

旧版 `ConfigProvider.config({ theme: { primaryColor, infoColor, successColor, warningColor, errorColor, processingColor } })`（CSS 变量模式）继续可用，内部会自动映射为对应 Token。高优先级规则：`processingColor` 与 `primaryColor` 同时存在时，`processingColor` 胜出（与旧版语义一致）。

## 一键切换：DarkModeToggle

`DarkModeToggle` 组件除了同步 `document.documentElement` 的 `data-theme` 属性外，还会通过 `ConfigProvider.config()` **自动切换全局主题算法**（`syncGlobalTheme`，默认开启），静态 API 与 holder 弹层会一并跟随暗/浅切换：

```vue
<template>
  <DarkModeToggle v-model:dark="isDark" />
</template>
```

- 受控（`v-model:dark`）与非受控（`defaultDark` / `followSystem`）两种模式均会联动
- 若页面已通过自己的状态管理 `<ConfigProvider>` 主题，可传 `:sync-global-theme="false"` 关闭全局写入，避免重复注册
- `data-theme` 属性仍然会同步（`applyToDocument`），供你自己的 CSS 变量使用

## 组件实例内的主题感知

在组件内部调用 `message` / `notification` 时，使用 `App.useApp()` 拿到**实例级 API**，它会通过 `Teleport` 保留 Vue 上下文，自动继承最近的 `ConfigProvider` 主题（App 组件需放置在 `ConfigProvider` 内）：

```vue
<script setup lang="ts">
import { App as XYApp } from 'xiaoye-ui';

const { message, notification, modal } = XYApp.useApp();
const onCopy = () => message.success('已复制');
</script>
```

- 同一时刻页面只建议存在一个 `App` 组件（挂载于根部），实例 API 即全局可用
- 若实在需要多个 `App`（如独立组件库预览区），每个实例内部各自感知最近的 Provider 主题

## 常见误区

| 误区 | 说明 |
| --- | --- |
| 进入暗色后手动覆盖组件颜色 | 不需要。全部由 Token 驱动，覆盖反而破坏一致性 |
| 认为 `rgba(0,0,0,0.88)` 是"硬编码" | 那是浅色 Token 的派生值，`darkAlgorithm` 下自动翻转 |
| 用 `:global()` 强行穿透 Portal 容器 | Portal 内的 DOM 主题由 Provider 链路保证，无需穿透 |
| 只用 `ConfigProvider.config()` 管页面主题 | `config()` 只作用于静态 API；页面组件必须用 `<ConfigProvider>` 包裹 |
| 依赖 Hash 稳定 | Hash 随 token/algorithm 变化是设计使然，样式自动重建 |

## 局限与兼容性

- **SSR**：`ConfigProvider.config()` 的 CSS 变量注册不支持 SSR（会输出 warning），页面级 `<ConfigProvider>` 无此限制
- **vc 内部控件**：虚拟滚动条、Tour 遮罩等底层控件存在少量与 antd 一致的半透明黑色既定样式，不影响整体可读性
