# 介绍

XiaoyeUI 是一套基于 Vue 3 + TypeScript 的高质量 UI 组件库。

## 特性

- **设计无关**: 不受任何设计规范约束，可以轻松适配各类设计风格
- **无障碍友好**: 遵循 WAI-ARIA 标准，支持键盘导航和屏幕阅读器
- **灵活配置**: 提供丰富的配置选项，满足各类业务场景需求
- **高性能**: 虚拟滚动、按需加载，首屏加载速度更快
- **国际化**: 内置多语言支持，轻松实现国际化
- **主题定制**: 支持 CSS 变量和动态主题切换

## 快速开始

```bash
npm install xiaoye-ui
```

在 main.ts 中引入：

```typescript
import { createApp } from 'vue'
import XiaoyeUI from 'xiaoye-ui'
import 'xiaoye-ui/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(XiaoyeUI)
app.mount('#app')
```
