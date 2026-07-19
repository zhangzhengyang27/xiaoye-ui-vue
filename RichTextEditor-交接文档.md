# RichTextEditor 富文本编辑器组件 — 交接文档

> 生成时间：2026-07-18参考项目：Nuxt UI v4（`/Users/xiaoye/Downloads/ui-4`）当前状态：**Beta** — 基本功能可用，仍有多项问题待修复

---

## 一、组件架构概览

### 1.1 目录结构

```
packages/xiaoye-ui/src/rich-text-editor/
├── index.ts                          # 导出入口（6 子组件 + 22 工具函数 + defaultToolbarItems + useEditorMenu）
├── RichTextEditor.tsx                # 主组件（~350 行）
├── RichTextEditorToolbar.tsx         # 工具栏组件（~400 行，支持 fixed/bubble/floating）
├── RichTextEditorDragHandle.tsx      # 拖拽手柄组件（~180 行）
├── EditorLinkPopover.tsx             # 链接编辑 Popover 组件（~200 行）
├── RichTextEditorMentionMenu.tsx     # @提及菜单组件（~130 行）
├── RichTextEditorEmojiMenu.tsx       # :emoji 菜单组件（~110 行）
├── RichTextEditorSuggestionMenu.tsx  # /斜杠命令菜单组件（~150 行）
├── richTextEditorTypes.ts            # 已废弃？未在 index.ts 引用
├── defaultToolbarItems.ts            # 7 组默认工具栏配置（40+ lucide SVG 图标内联）
├── types/
│   └── editor.ts                     # EditorHandler / EditorItem / EditorHandlers 类型定义
├── utils/
│   └── editor.ts                     # 22 个 handlers + 5 个工具函数（~700 行）
├── composables/
│   └── useEditorMenu.ts              # 菜单 position 计算 + Floating UI middleware（~300 行）
├── style/
│   └── index.ts                      # CSS-in-JS 样式（~1270 行，已按 ui-4 对齐重写）
└── __tests__/
    └── rich-text-editor.test.js      # 单元测试（~390 行，基本渲染测试 + mock）
```

### 1.2 组件关系图

```
RichTextEditor（主组件）
├── Props: modelValue, contentType, placeholder, starterKit(全部禁用), image, mention,
│          code, horizontalRule(自定义渲染), markdown, textAlign, textStyle, highlight,
│          underline, table, codeBlockShiki, extensions, editorProps, editorOptions,
│          plugins, as, disabled, plainText, immediateCreate
├── provide('editorHandlers', handlers) — 注入 handlers 给子组件
├── EditorContent（Tiptap 内置）
├── EditorLinkPopover（无 slot，纯 prop 驱动的链接编辑器）
│
└── 子组件（独立使用，用户灵活组合）：
    ├── RichTextEditorToolbar — items: EditorToolbarItem[][], layout: 'fixed'|'bubble'|'floating'
    ├── RichTextEditorDragHandle — 通过 FloatingUI 定位，支持 default slot
    ├── RichTextEditorSuggestionMenu — / 斜杠命令菜单
    ├── RichTextEditorMentionMenu — @ 提及菜单
    ├── RichTextEditorEmojiMenu — : emoji 菜单
    └── EditorLinkPopover — 链接编辑（via expose open/close）
```

### 1.3 注册 & 导出

- **组件注册**：通过 `registerComponent(XYRichTextEditor)` → 映射为 `xy-rich-text-editor` 标签
- **index.ts 导出**：所有 6 个子组件 + 22 个工具函数 + `defaultToolbarItems` + `useEditorMenu`
- **components.ts 注册**：已注册「RichTextEditor」到组件库
- **Token 注册**：已在 `theme/interface/components.ts` 注册 `RichTextEditor` 的 ComponentToken

### 1.4 依赖项

| 依赖                                | 版本   | 用途                                      |
| ----------------------------------- | ------ | ----------------------------------------- |
| @tiptap/vue-3                       | ^2.x   | Vue 3 绑定（useEditor / EditorContent）   |
| @tiptap/starter-kit                 | ^2.x   | 基础编辑器扩展集                          |
| @tiptap/extension-placeholder       | ^2.x   | 占位符                                    |
| @tiptap/extension-image             | ^2.x   | 图片支持                                  |
| @tiptap/extension-mention           | ^2.x   | @提及                                     |
| @tiptap/extension-code              | ^2.x   | 行内代码（替换 StarterKit 默认可选）      |
| @tiptap/extension-horizontal-rule   | ^2.x   | 分割线（自定义渲染 div[data-type=hr]>hr） |
| @tiptap/extension-table             | ^2.x   | 表格                                      |
| @tiptap/extension-table-row         | ^2.x   | 表格行                                    |
| @tiptap/extension-table-cell        | ^2.x   | 表格单元格                                |
| @tiptap/extension-table-header      | ^2.x   | 表头                                      |
| @tiptap/markdown                    | ^2.x   | Markdown 内容类型                         |
| @tiptap/extension-text-align        | ^2.x   | 文本对齐                                  |
| @tiptap/extension-text-style        | ^2.x   | 文本样式（文字颜色基础）                  |
| @tiptap/extension-underline         | ^2.x   | 下划线                                    |
| @tiptap/extension-highlight         | ^2.x   | 高亮                                      |
| @tiptap/extension-drag-handle-vue-3 | ^2.x   | 拖拽手柄扩展                              |
| @tiptap/suggestion                  | ^2.x   | 建议系统（mention/emoji/suggestion 基础） |
| @tiptap/extension-emoji             | ^2.x   | Emoji 扩展（未实现）                      |
| tiptap-extension-code-block-shiki   | latest | Shiki 代码高亮                            |
| defu                                | ^6.x   | 深层合并默认值                            |
| @floating-ui/dom                    | ^1.x   | 定位计算（菜单弹出位置）                  |

---

## 二、已完成工作

### 2.1 功能实现（参考 ui-4）

- [x] 基础编辑器渲染（StarterKit + 扩展配置）
- [x] 工具栏 7 组完整配置（历史/块类型/行内格式/链接图片表格/对齐/颜色高亮/清除）
- [x] 工具栏三种 layout（fixed / bubble / floating）
- [x] BubbleMenu / FloatingMenu 显示控制（shouldShow prop）
- [x] DragHandle 拖拽手柄（XYButton 实现，含 default slot）
- [x] SuggestionMenu 斜杠命令菜单
- [x] MentionMenu @提及菜单（支持 v-model:searchTerm 异步加载）
- [x] EmojiMenu : emoji 菜单（支持 grid / list 布局）
- [x] EditorLinkPopover 链接编辑（expose open/close）
- [x] 图片插入（URL 模式 + FileReader base64 文件上传）
- [x] 表格操作（插入/列/行/合并/拆分/表头切换）
- [x] 文本颜色 / 高亮选择器
- [x] AI 流式补全（基础对话框架 + setTimeout 模拟流式）
- [x] Markdown / HTML / JSON 内容类型
- [x] Placeholder（firstLine / everyLine 两种模式）
- [x] 编辑状态切换（disabled/editable）

### 2.2 样式对齐（参考 ui-4 像素级重写）

- [x] 工具栏按钮 28×28px（icon 16×16 + padding 6px），border-radius 6px
- [x] 工具栏组间 gap 6px，组内 gap 2px
- [x] 工具栏按钮默认色 colorText（不是 colorTextSecondary）
- [x] 工具栏按钮 hover bg-elevated（colorBgLayout），active primary 10%
- [x] 工具栏容器 fixed: padding 4px 8px；bubble/floating: padding 4px + border-radius 8px
- [x] 内容区 padding 32px
- [x] 标题字号 h1=30/36, h2=24/32, h3=20/28, h4=18/28, h5/h6=16/24
- [x] 行内 code 14px + 6px 半径 + border-muted
- [x] pre 代码块 14px/24px + padding 12px/16px + border-radius 6px
- [x] blockquote 左边框 4px colorBorder + padding-left 16px
- [x] ul/ol padding-left 24px + marker 颜色
- [x] 菜单容器 min-width 192 / max-width 240 / max-height 384
- [x] 菜单 item 使用 ::before 伪元素实现 hover 背景（ui-4 关键视觉特征）
- [x] Tooltip height 24px + padding 4px 10px + border-radius 2px + shadow-sm
- [x] 按钮 disabled opacity 0.75（非 0.4）
- [x] 内容区子元素 margin-block 20px
- [x] 标题 h1-h6 margin-block 20px
- [x] blockquote 使用 colorTextSecondary 提升可读性
- [x] placeholder 行高与段落一致（28px）并兼容 `is-editor-empty`
- [x] img border-radius 6px + selectednode outline 2px primary
- [x] hr 自定义渲染 div[data-type=horizontalRule] + my-8 py-2
- [x] Toolbar Tooltip 应用 hashId 并修正 fixed 定位
- [x] 下拉菜单项默认图标颜色从 colorTextQuaternary 调整为 colorTextSecondary

### 2.3 文档覆盖

- [x] `apps/docs/components/rich-text-editor.md` 重写完成
- [x] 16 个示例的 demo 引用：basic / toolbar / bubble-toolbar / floating-toolbar / drag-handle / drag-handle-dropdown / suggestion-menu / suggestion-menu-items / mention-menu / mention-menu-items / emoji-menu / table / link-popover / text-color / highlight / image / image-upload / ai-completion
- [x] 22 个示例文件全部完成（含 6 个子组件的完整使用演示）
- [x] 6 个子组件完整 API 表格（Props / Events / Slots / Expose）
- [x] FAQ 常见问题

---

## 三、已知问题 & 待修复

按优先级从高到低排列：

### P0 — 运行时错误

| ID | 问题 | 文件 | 描述 |
| --- | --- | --- | --- |
| BUG-01 | `XYEditorLinkPopover` editor prop 类型警告 | `EditorLinkPopover.tsx` | 控制台报 `Invalid prop: type check failed for prop "editor". Expected Object, got Undefined`。原因是 LinkPopover 挂载时 editor 还没就绪，应在 editor 创建后再 mount |
| BUG-02 | **~~Enter 键导致焦点跳转到下一个编辑器~~（已修复）** | `RichTextEditor.tsx` | 文档站点中多个编辑器实例共存时，按 Enter 键可能因事件冒泡被文档层面处理程序捕获，导致焦点异常切换到下一个编辑器。已在 `editorProps.handleKeyDown` 中阻止 Enter 事件冒泡，同时保留 Tiptap 默认段落创建行为 |

### P1 — 功能缺失

| ID | 问题 | 文件 | 描述 |
| --- | --- | --- | --- |
| MISS-01 | **SuggestionMenu 未关联 Tiptap 建议插件** | `RichTextEditor.tsx` | 输入 `/` 不会触发 SuggestionMenu。需要在主组件中集成 `@tiptap/suggestion` 插件，在输入 `/` 时触发菜单弹出。参考 ui-4 的 `useEditorMenu.ts` 实现 |
| MISS-02 | **MentionMenu 未关联 Tiptap mention 扩展** | `RichTextEditor.tsx` | 输入 `@` 不会触发 MentionMenu。mention 扩展当前只有基础配置（HTMLAttributes），缺少 suggestion 回调配置 |
| MISS-03 | **EmojiMenu 未关联 Tiptap emoji 扩展** | `RichTextEditor.tsx` | 输入 `:` 不会触发 EmojiMenu。需要集成 `@tiptap/extension-emoji` 或其 suggestion 替代方案 |
| MISS-04 | **~~BubbleMenu/FloatingMenu 未自动注册到工具栏~~（已修复）** | `RichTextEditorToolbar.tsx` | `RichTextEditorToolbar` 已根据 `layout` 动态使用 Tiptap 内置 `BubbleMenu` / `FloatingMenu` 组件包裹工具栏，并通过 `shouldShow` / `options` 控制显示时机与定位 |
| MISS-05 | **~~DragHandle dropdown 中 move/delete 操作缺少 pos 参数~~（已修复）** | 示例文件 | `RichTextEditorDragHandle` 的 `nodeChange` 事件已正确携带当前节点 `pos`，`drag-handle-dropdown.vue` 示例通过 `currentNode.value.pos` 动态传递给 handler |

### P2 — 样式/视觉

| ID | 问题 | 描述 |
| --- | --- | --- |
| STYLE-01 | **taskList 列表样式** | 任务列表（taskList/taskItem）缺少独立的样式规则（勾选框、缩进、颜色等） |
| STYLE-02 | **表格样式简化** | 表格 border-collapse、th/td padding、alternate row background 等样式可参考 ui-4 优化 |
| STYLE-03 | **Dark mode 验证** | 样式已使用 Design Token（理论上 dark mode 应自动适配），但未实际验证 dark mode 下的效果 |
| STYLE-04 | **代码块 Shiki 主题配置** | `codeBlockShiki` 扩展目前未配置 theme，在 dark mode 下代码高亮主题可能不匹配 |

### P3 — 测试覆盖

| ID | 问题 | 描述 |
| --- | --- | --- |
| TEST-01 | **基础渲染测试** | ✅ 已有（mountTest + name/flag/class/expose） |
| TEST-02 | **子组件渲染测试** | ✅ 已有（Toolbar / DragHandle / LinkPopover / MentionMenu / EmojiMenu / SuggestionMenu） |
| TEST-03 | **工具栏按钮交互测试** | ❌ 缺少（按钮点击、dropdown 展开、active 状态切换） |
| TEST-04 | **DragHandle 交互测试** | ❌ 缺少（拖拽、下拉菜单、位置更新） |
| TEST-05 | **MentionMenu / EmojiMenu / SuggestionMenu 交互测试** | ❌ 缺少 |
| TEST-06 | **LinkPopover 编辑测试** | ❌ 缺少（打开/关闭、URL 编辑、apply/cancel） |
| TEST-07 | **Editor 扩展配置测试** | ❌ 缺少（starterKit 禁用项、自定义扩展合并） |
| TEST-08 | **E2E 测试** | ❌ 完全缺失 |

### P4 — 体验优化

| ID | 问题 | 描述 |
| --- | --- | --- |
| UX-01 | **AI 流式补全是 stub** | 当前 AI 补全只是简单的 setTimeout 模拟，需要对接真实 AI API |
| UX-02 | **图片上传没有自定义上传 URI 配置** | 当前内置上传使用 FileReader base64，生产环境需要上传到对象存储获取 URL。缺少类似 `uploadUrl` 的 prop 和 `uploadHandler` 回调 |
| UX-03 | **代码块没有复制按钮** | 代码块右上角缺少"复制代码"按钮（常见 UX 需求） |
| UX-04 | **LinkPopover 没有预设 URL 匹配** | 当前只支持手动输入 URL，没有粘贴剪贴板 URL 的自动识别 |
| UX-05 | **Emoji 搜索功能** | EmojiMenu 缺少搜索过滤能力 |

---

## 四、样式系统说明

### 4.1 Token 映射

```
ui-4 CSS 变量            → ant Design Token
───                     ───
--ui-bg                 → colorBgContainer
--ui-bg-muted           → colorBgLayout
--ui-bg-elevated        → colorBgLayout（ant 没有 bg-elevated 对应）
--ui-bg-accented         → colorFillSecondary
--ui-text               → colorText
--ui-text-muted          → colorTextSecondary
--ui-text-dimmed        → colorTextQuaternary
--ui-text-highlighted   → colorText
--ui-text-inverted       → colorTextLightSolid
--ui-border              → colorBorderSecondary
--ui-border-muted        → colorBorderSecondary
--ui-border-accented     → colorBorder
--ui-color-primary       → colorPrimary
```

### 4.2 ComponentToken 默认值

```typescript
{
  contentPadding: 32,        // 编辑器内容区内边距
  contentMinHeight: 84,      // 编辑器内容区最小高度
  toolbarButtonHeight: 28,   // 工具栏按钮尺寸（sm + square = 28px）
  toolbarButtonSize: 28,     // 同上
  toolbarButtonGap: 6,       // 工具栏组间间距
  toolbarGroupGap: 2,        // 工具栏组内按钮间距
  menuMinWidth: 192,         // 菜单最小宽度
  menuMaxWidth: 240,         // 菜单最大宽度
  menuMaxHeight: 384,        // 菜单最大高度
  linkPopoverMinWidth: 320,  // 链接 popover 最小宽度
}
```

### 4.3 透明度变体实现

ui-4 大量使用透明度变体（`bg-primary/10`、`bg-primary/20`、`bg-elevated/50`），在 CSS-in-JS 中通过 `color-mix()` 实现：

```typescript
const activeBg = `color-mix(in srgb, ${colorPrimary} 10%, transparent)`;
const itemHoverBg = `color-mix(in srgb, ${colorBgLayout} 50%, transparent)`;
```

---

## 五、版本历史

| 日期 | 变更 |
| --- | --- |
| 2026-07-17 | 初始创建（从 ui-4 抄写），基础 5 个子组件 + 工具栏 + 样式 |
| 2026-07-18 | 修复 safeCanCall 避免 `editor.can() is not a function` 错误 |
| 2026-07-18 | 样式全面重写（像素级对齐 ui-4） |
| 2026-07-18 | 22 个示例文件 + 文档重写 + FAQ |
| 2026-07-18 | 调试 VitePress 缓存 + 浏览器验证通过 |
| 2026-07-19 | 修复 `EditorLinkPopover` `autoOpen` 挂载即打开问题 |
| 2026-07-19 | 调整 `basic.vue` 示例，移除 `auto-open`，避免链接弹窗默认打开 |
| 2026-07-19 | 微调 hover/active 背景透明度，进一步对齐 ui-4 |
| 2026-07-19 | 修复 Toolbar Tooltip hashId 不生效及 fixed 定位偏移问题 |
| 2026-07-19 | 优化下拉菜单项默认图标颜色，提升可读性 |
| 2026-07-19 | 优化内容区样式：标题 margin、blockquote 颜色、placeholder 行高 |
| 2026-07-19 | 1:1 移植 ui-4 工具栏样式：按钮宽度自适应、trailingIcon、focus-visible outline |
| 2026-07-19 | 修复下拉菜单被父容器裁剪：dropdown-panel 改为 fixed 定位并基于触发按钮计算坐标 |
| 2026-07-19 | 修复链接按钮 slot 失效：改用 `kind: 'link'` 配置 |
| 2026-07-19 | 修复 Suggestion/Mention/Emoji 菜单样式失效：updateProps 传递 `hashId` |
| 2026-07-19 | 修复链接 Popover 定位：基于当前选区/光标计算 fixed 坐标 |
| 2026-07-19 | 对齐 ui-4 默认 placeholder 模式为 `everyLine`，内容区内边距 32px |
| 2026-07-19 | 工具栏图标统一 `color: currentColor`，兼容 `is-editor-empty` 占位符类名 |
| 2026-07-19 | RichTextEditor 单元测试全部通过（139 files / 1186 tests） |
| 2026-07-19 | 修复 MISS-05：`RichTextEditorDragHandle` 正确传递当前节点 `pos` 给下拉菜单操作 |
| 2026-07-19 | 修复 MISS-04：`RichTextEditorToolbar` 使用 Tiptap 内置 `BubbleMenu` / `FloatingMenu` 包裹工具栏 |
| 2026-07-19 | 浏览器验证 bubble / floating toolbar 显示与交互正常 |
| 2026-07-19 | 修复 BUG-02：RichTextEditor 中按 Enter 键焦点意外跳转到下一个编辑器的问题 |

---

## 六、下一步工作建议

### 已完成

1. **BUG-01**：`EditorLinkPopover` editor prop 类型警告已修复（改为非 required + 主组件条件渲染）。
2. **MISS-01/02/03**：`/` `@` `:` 三个菜单已关联 Tiptap suggestion/mention 插件。
3. **EditorLinkPopover autoOpen**：移除 `immediate: true`，避免页面加载即打开链接弹窗。
4. **工具栏样式**：1:1 移植 ui-4 工具栏样式，修复按钮宽度、trailingIcon、focus-visible outline、下拉菜单被裁剪、Tooltip fixed 定位等问题。
5. **链接按钮**：修复 slot 失效，改用 `kind: 'link'` 配置并支持快捷键提示。
6. **菜单样式**：修复 Suggestion/Mention/Emoji 菜单因缺少 `hashId` 导致样式失效的问题。
7. **链接 Popover 定位**：改为基于当前选区/光标计算 fixed 坐标，避免出现在编辑器左上角。
8. **placeholder & 内容区**：默认模式改为 `everyLine`，内容区水平内边距对齐 ui-4 为 32px，兼容 `is-editor-empty` 类名。
9. **单元测试**：RichTextEditor 相关测试全部通过（139 files / 1186 tests）。
10. **MISS-05**：`RichTextEditorDragHandle` 的 `nodeChange` 事件已正确传递当前节点 `pos`，`drag-handle-dropdown.vue` 示例使用 `currentNode.value.pos` 执行复制/删除/上移/下移操作。
11. **MISS-04**：`RichTextEditorToolbar` 已根据 `layout` 动态使用 Tiptap 内置 `BubbleMenu` / `FloatingMenu` 包裹工具栏，浏览器验证 bubble/floating 显示与交互正常。
12. **BUG-02**：修复文档站点中多个编辑器实例共存时，按 Enter 键焦点意外跳转到下一个编辑器的问题；在 `editorProps.handleKeyDown` 中阻止 Enter 事件冒泡，保留 Tiptap 默认段落创建行为。

### 短期（1-2 天）

1. **解决全包 typecheck 错误**：当前 `pnpm --filter xiaoye-ui typecheck` 仍有大量历史错误，主要来自迁移中的 `data-table`、`markdown-editor`、`back-top`、`ripple`、`tree-table` 等组件；`rich-text-editor` 目录本身无新错。建议先修复这些迁移组件的类型问题，或将其从当前构建/检查范围排除，再重新跑 typecheck。

### 中期（3-5 天）

4. **补充 P3 测试**：交互测试 + 集成测试
5. **LinkPopover 定位优化**：当前 popover 已基于选区/光标定位，后续可进一步优化为锚定工具栏链接按钮

### 长期

6. **对接真实 AI API**（UX-01）
7. **图片上传服务端集成**（UX-02）
8. **Dark mode 验证 + Shiki 主题配置**
9. **表格、taskList 等样式增强**
