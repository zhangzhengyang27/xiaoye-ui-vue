# 交互式文档站改造设计文档

## 任务目标

将当前 `docs/` 目录下的 VitePress 静态文档站，改造为类似 Element Plus 的可交互组件演示站：每个组件文档中通过 `:::demo` 容器渲染可实时交互的 Vue SFC，并提供源码查看、复制等功能。

## 当前项目状态

- `docs/` 使用 VitePress 1.x，仅包含 Markdown API 表格，无交互演示。
- `apps/showcase/` 是独立的 Nuxt 演示站，里面有 `.vue` demo 文件，但**本次改造不直接复用**。
- `plugin/md/` 有旧的 markdown 转 vue 插件，但**本次改造直接复用 Element Plus 的现成方案**。

## 参考来源

Element Plus 仓库已下载到本地：

```
/Users/xiaoye/Downloads/element-plus-dev
```

核心参考文件：

| 文件 | 作用 |
| --- | --- |
| `docs/.vitepress/plugins/demo.ts` | `:::demo` markdown-it 容器插件 |
| `docs/.vitepress/vitepress/components/vp-demo.vue` | Demo 渲染组件（交互区 + 操作栏 + 源码区） |
| `docs/.vitepress/vitepress/components/demo/vp-source-code.vue` | 源码展示组件 |
| `docs/.vitepress/config/plugins.ts` | markdown-it 插件注册入口 |
| `docs/.vitepress/plugins/markdown-transform.ts` | Vite 插件：自动导入 demo 组件、追加脚本 |
| `docs/.vitepress/config/vite.ts` | Vite 配置（别名、自动导入等） |
| `docs/.vitepress/theme/index.ts` | 主题入口，注册全局 Demo 组件 |
| `docs/en-US/component/button.md` | markdown 中使用 `:::demo` 的示例 |
| `docs/examples/button/basic.vue` | demo SFC 示例 |

## 改造范围

### 第一阶段：试点（推荐先做）

以 `general/button.md` 为试点，完成从静态文档到交互式文档的端到端打通。

### 第二阶段：扩展（待试点验收后）

将 `:::demo` 写法推广到所有组件分类（general、layout、navigation、data-entry、data-display、feedback、other）。

> 本次设计聚焦第一阶段，第二阶段复用第一阶段的模式批量扩展。

## 方案架构

Element Plus 的核心数据流：

```
button.md
  :::demo button/basic
  :::
        │
        ▼
  markdown-it-container (demo.ts)
        │
        ├── 读取 docs/examples/button/basic.vue 源码
        ├── 用 ts2js 生成 JS 版本
        ├── 用 markdown-it 渲染源码为带语法高亮的 HTML
        └── 输出：<Demo sources="..." raw-sources="..." path="button/basic" description="...">
                <template #source><ButtonBasic /></template>
              </Demo>
        │
        ▼
  MarkdownTransform Vite 插件
        │
        └── 自动为每个 component/*.md 注入：
            import ButtonBasic from '../../examples/button/basic.vue'
        │
        ▼
  VitePress 编译为 .vue SFC
        │
        ▼
  浏览器运行 <Demo> 组件
        │
        ├── 渲染 slot #source（实时可交互的 button/basic.vue）
        ├── 提供"显示/隐藏源码"、"复制源码"等操作
        └── 用 v-html 展示 sources 中已高亮的源码
```

## 需要新增/修改的文件清单

### 1. 新增 demo 源码目录

```
docs/
  examples/
    button/
      basic.vue
      disabled.vue
      ghost.vue
      icon.vue
      loading.vue
      size.vue
      block.vue
      ...（根据 button 组件能力补充）
```

每个 `.vue` 文件是标准 SFC，模板中直接使用 `a-button`、`a-space` 等 xiaoye-ui 组件（全局自动导入）。

### 2. 新增/复制 EP 的 markdown-it 容器插件

文件：`docs/.vitepress/plugins/demo.ts`

从 Element Plus 复制 `docs/.vitepress/plugins/demo.ts`，做以下适配：

- 移除对 `@element-plus/build-utils` 的依赖，将 `docRoot` 改为基于 `__dirname` 的相对路径或 VitePress 根目录。
- 保留 `sfcTs2js` 调用，但后面第 5 步会把工具函数复制到本地。
- 组件名插槽生成规则：`ep-${sourceFile.replaceAll('/', '-')}` 改为 `xy-${sourceFile.replaceAll('/', '-')}`，避免与 EP 冲突。
- 输出标签保持 `<Demo>`（通过 theme 全局注册）。

### 3. 新增 Demo 渲染组件

文件：

- `docs/.vitepress/vitepress/components/vp-demo.vue`
- `docs/.vitepress/vitepress/components/demo/vp-source-code.vue`

从 Element Plus 复制并做以下适配：

- 移除 Element Plus 专属依赖：`EVENT_CODE`、`useLang`、`demoBlockLocale`、`useSourceCode`、`usePlayground`、Element Plus 图标等。
- 保留核心功能：源码显示/隐藏切换、TS/JS 切换（可选）、复制源码。
- 操作栏图标可用简单 SVG 或文字按钮替代，避免引入 `unplugin-icons` 等复杂依赖。
- 样式变量使用 VitePress CSS 变量或 xiaoye-ui 的 CSS 变量。
- `vp-source-code.vue` 几乎可直接复用。

### 4. 注册 markdown 插件

文件：`docs/.vitepress/config/index.ts`

在 VitePress 配置中增加：

```ts
import createDemoContainer from '../plugins/demo'
import mdContainer from 'markdown-it-container'

export default defineConfig({
  // ... 现有配置
  markdown: {
    config: (md) => {
      md.use(mdContainer, 'demo', createDemoContainer(md))
    },
  },
})
```

### 5. 新增 Vite 插件：自动导入 demo 组件

文件：`docs/.vitepress/plugins/markdown-transform.ts`

从 Element Plus 复制 `MarkdownTransform` 插件并适配：

- 监听 `.md` 文件 transform。
- 当文件位于 `docs/general/`、`docs/layout/` 等组件文档目录时，自动注入对应 `docs/examples/{componentId}/*.vue` 的 import 语句。
- import 路径根据实际目录结构调整。
- 暂时不需要 `VpComponentMeta`、contributors、source links 等附加功能，可移除。

### 6. Vite 配置适配

文件：`docs/.vitepress/config/index.ts` 或新建 `docs/.vitepress/config/vite.ts`

需要配置：

- **别名**：`~/` → `docs/.vitepress/vitepress/`
- **unplugin-vue-components**：自动注册 `docs/.vitepress/vitepress/components` 下的组件，并支持在 `.md` 中使用。
- **noExternal**：SSR 时不要把 xiaoye-ui 相关包 externalize（避免 SSR 报错）。
- **optimizeDeps**：预构建 xiaoye-ui 相关依赖。

示例：

```ts
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, '../vitepress')}/`,
      },
    },
    plugins: [
      Components({
        dirs: ['.vitepress/vitepress/components'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),
      MarkdownTransform(),
    ],
    ssr: {
      noExternal: ['xiaoye-ui'],
    },
  },
})
```

### 7. 主题入口注册全局 Demo 组件

文件：`docs/.vitepress/theme/index.ts`

从：

```ts
import DefaultTheme from 'vitepress/theme'
import './custom.css'
export default { extends: DefaultTheme }
```

改为：

```ts
import DefaultTheme from 'vitepress/theme'
import Demo from '../vitepress/components/vp-demo.vue'
import './custom.css'
import '../vitepress/styles/index.css' // 如果需要

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
    // 注册 xiaoye-ui 组件库
    // app.use(XiaoyeUI)
  },
}
```

> 注意：xiaoye-ui 组件可以通过 `unplugin-vue-components` 自动导入，也可以全局 `app.use()`。

### 8. 修改试点组件文档

文件：`docs/general/button.md`

将现有纯 API 文档改为：

```markdown
# Button

按钮用于开始一个即时操作。

## 基础用法

:::demo 通过设置 `type` 属性来定义按钮样式。

button/basic

:::

## 不可用状态

:::demo 添加 `disabled` 属性即可让按钮处于不可用状态。

button/disabled

:::

## API

（保留原有 API 表格）
```

### 9. 新增 ts2js 工具函数

文件：`docs/.vitepress/utils/ts2js.ts`

从 Element Plus 复制 `sfcTs2js` 函数。需要安装依赖：

- `typescript`（已安装）
- `@prettier/sync`（如果要用 prettier 格式化 JS 输出，否则可简化）

可简化为不依赖 `@prettier/sync` 的版本。

## 依赖安装

需要在 `docs/package.json` 中新增以下依赖：

```json
{
  "devDependencies": {
    "vitepress": "^1.6.4",
    "markdown-it-container": "^3.0.0",
    "unplugin-vue-components": "^0.x",
    "@vitejs/plugin-vue-jsx": "^5.x",
    "@vueuse/core": "^8.x",
    "tinyglobby": "^0.x"
  }
}
```

实际版本号与根目录已安装的版本保持一致即可。

## 验证方式

1. 在 `docs/` 目录执行 `pnpm dev`。
2. 访问 `/general/button`。
3. 检查每个 `:::demo` 块是否正确渲染为可交互 demo。
4. 点击"显示源码"按钮，检查源码是否正确高亮。
5. 点击"复制源码"，检查剪贴板内容正确。

## 关键适配点总结

| EP 原实现 | 本项目适配 |
| --- | --- |
| `docRoot` 来自 `@element-plus/build-utils` | 改为 `path.resolve(__dirname, '../..')` |
| 组件前缀 `el-` | 改为 `a-`（Ant Design Vue） |
| demo 插槽组件名 `ep-button-basic` | 改为 `xy-button-basic` |
| `unplugin-icons` + Element Plus 图标 | 可简化，用简单 SVG 或文字按钮 |
| `useLang` / `demoBlockLocale` 多语言 | 先支持中文，文案写死或简化 |
| `useSourceCode` GitHub 链接 | 可选保留，改为 xiaoye-ui 仓库地址 |
| `usePlayground` 在线运行 | 第一阶段可不做 |

## 风险与注意事项

1. **SSR 问题**：demo 组件在服务端渲染时可能报错，建议在 `<Demo>` 组件内部用 `ClientOnly` 包裹交互区，或在 VitePress 配置中设置 `ssr.noExternal`。
2. **样式冲突**：demo 组件的样式不要污染全局，尽量使用 scoped + CSS 变量。
3. **demo 组件全局注册**：必须确保 `unplugin-vue-components` 的 `include` 包含 `.md`，否则 markdown 中引用的 `xy-button-basic` 不会被自动注册。
4. **路径问题**：`import.meta.glob` 或 `MarkdownTransform` 中使用的相对路径需要在实际项目中验证。

## 下一步

1. 按本设计实现第一阶段（button 试点）。
2. 用户验收后，按相同模式批量迁移其他组件文档。
