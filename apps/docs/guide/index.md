# 介绍

XiaoyeUI 是一套基于 Vue 3 + TypeScript 的企业级 UI 组件库，采用 pnpm monorepo 架构管理多个子包。组件标签统一使用 `xy-` 前缀，组件内部 `name` 使用 `XYXxx` 格式，致力于为 AI 辅助开发和中后台业务提供一致、可扩展的组件解决方案。

## 核心特性

### 统一的品牌前缀

所有组件均从原 `ant-` 前缀迁移至 `xy-` 前缀，包括：

- 组件标签：`<xy-button>`、`<xy-input>`、`<xy-select>`
- CSS 类名：`.xy-btn`、`.xy-input`
- 内部标识：`__XY_BUTTON` 等

这一约定让项目拥有独立的品牌标识，同时保持与 Ant Design 相似的 API 体验。

### Vue 3 + TypeScript

- 使用 Vue 3 Composition API 实现组件逻辑
- 完整的 TypeScript 类型定义
- 支持 `<script setup lang="ts">` 和 `defineComponent` 两种风格

### CSS-in-JS 主题系统

基于 Design Token 机制构建样式系统：

```
Seed Token → Map Token → Alias Token → Component Token
```

- 支持动态主题切换（亮色 / 暗色）
- 通过 `ConfigProvider` 全局配置主题 Token
- 组件样式使用 `genComponentStyleHook` 生成，避免硬编码

### Monorepo 架构

```
packages/
├── xiaoye-ui/              # 主组件库（80+ 组件）
├── core/                   # 核心响应式工具
├── utils/                  # 通用工具函数
├── icons/                  # 图标库
├── metadata/               # 组件元数据
├── vite-plugin/            # Vite 自动导入插件
├── auto-import-resolver/   # 自动导入解析器
└── nuxt-module/            # Nuxt.js 模块
```

### AI / LLM 友好

XiaoyeUI 为 AI 助手提供了丰富的结构化信息：

- 项目根目录的 `AGENTS.md`、`.cursorrules`、`.github/copilot-instructions.md`、`claude.md` 等规则文件
- 文档站托管 `/llms.txt` 和 `/llms-full.txt`，供 LLM 消费组件库完整信息
- 运行 `pnpm generate:llms` 可在文档更新后重新生成 LLM 文档

## 组件分类

| 分类     | 组件示例                                   |
| -------- | ------------------------------------------ |
| 通用     | Button、Icon、Typography、Grid、Space      |
| 布局     | Layout、Menu、Tabs、Breadcrumb、Pagination |
| 数据录入 | Input、Select、Form、DatePicker、Upload    |
| 数据展示 | Table、List、Card、Tree、Calendar          |
| 反馈     | Alert、Modal、Message、Notification        |
| 其他     | ConfigProvider、Divider、PageHeader        |

## 快速开始

```bash
pnpm add xiaoye-ui
```

```typescript
import { createApp } from 'vue';
import XiaoyeUI from 'xiaoye-ui';
import App from './App.vue';

const app = createApp(App);
app.use(XiaoyeUI);
app.mount('#app');
```

在模板中直接使用：

```vue
<xy-button type="primary">主要按钮</xy-button>
```

## 浏览器支持

- Chrome >= 80
- Firefox >= 78
- Safari >= 13
- Edge >= 80

## 下一步

- [安装](/guide/installation) — 了解多种安装和引入方式
- [LLM / AI 使用](/guide/llm) — 查看如何在 AI 助手中使用 XiaoyeUI
- [Button 组件](/components/button) — 从 Button 开始了解组件用法
