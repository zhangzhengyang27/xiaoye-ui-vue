# RichTextEditor 富文本编辑器

基于 [Tiptap](https://tiptap.dev/) 的现代富文本编辑器，内置 StarterKit、图片、@提及、表格、代码块高亮、文本对齐、高亮标记、Markdown 等扩展，并提供 5 个可独立使用的子组件：

- `RichTextEditorToolbar`：完整工具栏组件，支持 `fixed` / `bubble` / `floating` 三种布局
- `RichTextEditorDragHandle`：节点拖拽手柄，hover 节点时显示
- `RichTextEditorMentionMenu`：`@` 提及菜单
- `RichTextEditorEmojiMenu`：`:` emoji 菜单（grid 布局）
- `RichTextEditorSuggestionMenu`：`/` 斜杠命令菜单
- `EditorLinkPopover`：链接编辑气泡

## 何时使用

- 需要高度可定制、扩展性强的富文本编辑场景（如博客编辑、知识库、协作文档）。
- 需要 HTML / JSON / Markdown 多种内容格式输入输出的场景。
- 需要代码块语法高亮、表格、@提及等高级能力的场景。
- 需要按需启停扩展能力的场景。

## 基础用法

:::demo 使用 `v-model` 绑定 HTML 字符串。通过默认插槽接收 `editor` 与 `handlers`，调用 `handlers.bold.execute(editor).run()` 即可触发对应命令，`isActive` 用于按钮高亮状态。

rich-text-editor/basic

:::

## 完整工具栏

:::demo 下例展示了完整工具栏配置，涵盖历史操作、块类型、文本格式、链接/图片/表格、对齐、文字颜色/高亮、清除格式 7 组操作，可直接使用导出的 `defaultToolbarItems`。

rich-text-editor/toolbar

:::

## Bubble 工具栏

:::demo `RichTextEditorToolbar` 的 `layout="bubble"` 会在选中文本时浮现。可通过 `shouldShow` 自定义显示时机。

rich-text-editor/bubble-toolbar

:::

## Floating 工具栏

:::demo `layout="floating"` 会在空段落时浮现，常用于快捷插入块。

rich-text-editor/floating-toolbar

:::

## Drag Handle 拖拽手柄

:::demo 节点 hover 时显示拖拽手柄，支持拖动重排。监听 `hover` 事件获取当前节点信息。

rich-text-editor/drag-handle

:::

## Drag Handle Dropdown 联动

:::demo 拖拽手柄点击时弹出下拉菜单，提供复制/删除/上移/下移等节点操作。监听 `nodeChange` 事件（点击触发）获取节点信息。

rich-text-editor/drag-handle-dropdown

:::

## 斜杠命令 `/` Suggestion Menu

:::demo 输入 `/` 触发斜杠命令菜单，提供插入标题、列表、引用、代码块等操作。

rich-text-editor/suggestion-menu

:::

## 自定义斜杠命令 items

:::demo 通过 `items` prop 自定义菜单项，支持 `description`、`icon`、`label`/`separator` 类型项。

rich-text-editor/suggestion-menu-items

:::

## `@` 提及 Mention Menu

:::demo 输入 `@` 触发提及菜单，items 支持 `avatar`（自动渲染 `xy-avatar`）、`description`、`icon` 等字段。

rich-text-editor/mention-menu

:::

## Mention Menu 异步加载

:::demo 通过 `v-model:search-term` 获取搜索词，异步加载提及项；配合 `ignore-filter` 关闭内置过滤。

rich-text-editor/mention-menu-items

:::

## `:` Emoji Menu

:::demo 输入 `:` 触发 emoji 菜单，默认 `grid` 布局（8 列网格），紧凑显示大量 emoji。

rich-text-editor/emoji-menu

:::

## 表格操作

:::demo 演示插入表格、行列增删、合并/拆分单元格、切换表头等表格操作。

rich-text-editor/table

:::

## 链接 Popover

:::demo 独立使用 `EditorLinkPopover`，通过 `auto-open` 自动打开，或通过 `expose` 的 `open()` / `close()` 方法手动控制。

rich-text-editor/link-popover

:::

## 文字颜色

:::demo 演示 `textColor` handler 的用法，提供预设色板与清除颜色按钮。

rich-text-editor/text-color

:::

## 高亮 Highlight

:::demo 演示 `highlight` handler 的用法，提供预设高亮色与清除按钮。

rich-text-editor/highlight

:::

## 图片内置上传

:::demo 演示内置 image handler 的文件上传能力，调用 `handlers.image.execute(editor, { src })` 即可插入图片。

rich-text-editor/image

:::

## 自定义图片上传

:::demo 通过 `handlers` prop 覆盖默认 `image` handler，模拟异步上传流程（loading 状态 + URL 回填）。

rich-text-editor/image-upload

:::

## AI 流式补全

:::demo 通过 `editor.commands.insertContent` 逐字插入，模拟 AI 流式补全效果。

rich-text-editor/ai-completion

:::

## 占位文本

:::demo `placeholder` 支持字符串或对象形式。字符串形式直接显示文本；对象形式可配置 `placeholder`、`mode`（`'firstLine'` / `'everyLine'`）等选项。

rich-text-editor/placeholder

:::

## 可编辑切换

:::demo 通过 `disabled` 属性可切换编辑器的可编辑状态。禁用后内容不可修改，工具栏按钮也应同步禁用以保持一致性。

rich-text-editor/editable

:::

## 扩展配置

:::demo 通过 `image` / `mention` / `table` / `codeBlockShiki` 等属性可开关对应扩展；`starterKit` 可配置内置扩展（如标题级别）。切换开关后会重建编辑器实例以应用新配置。

rich-text-editor/extensions

:::

## 代码块语法高亮

:::demo `codeBlockShiki` 默认开启，使用 Shiki 进行代码语法高亮。可通过对象配置自定义主题（如 `material-theme-palenight`）。需同时禁用 StarterKit 内置的 `codeBlock` 以避免冲突。

rich-text-editor/code-block

:::

## API

### RichTextEditor Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 编辑器内容，类型随 `contentType` 变化 | string \| object | - |
| as | 根元素标签或组件 | string \| object | `'div'` |
| contentType | 内容格式 | `'json'` \| `'html'` \| `'markdown'` | 自动推断（字符串为 `html`，其余为 `json`） |
| placeholder | 占位文本，可为字符串或对象配置 | string \| object | - |
| starterKit | StarterKit 扩展配置，详见 Tiptap 文档 | object | 内置默认值 |
| image | 图片扩展配置，`false` 关闭 | boolean \| object | `true` |
| mention | @提及扩展配置，`false` 关闭 | boolean \| object | `true` |
| table | 表格扩展配置，`false` 关闭 | boolean \| object | `true` |
| markdown | Markdown 扩展配置（仅 `contentType='markdown'` 时输出 Markdown） | object | - |
| codeBlockShiki | 代码块 Shiki 高亮配置，`false` 关闭 | boolean \| object | `true` |
| disabled | 是否禁用编辑 | boolean | `false` |
| extensions | 额外的 Tiptap 扩展数组 | array | - |
| editorProps | ProseMirror editorProps 配置 | object | 内置默认值 |
| handlers | 自定义命令处理函数，会与内置 handlers 合并 | object | - |

### RichTextEditor Events

| 事件名            | 说明                                          | 回调参数               |
| ----------------- | --------------------------------------------- | ---------------------- |
| update:modelValue | 内容变化时触发，参数类型随 `contentType` 变化 | `(value: any) => void` |

### RichTextEditor Slots

| 插槽名  | 说明               | 插槽参数                                       |
| ------- | ------------------ | ---------------------------------------------- |
| default | 自定义工具栏等内容 | `{ editor: Editor, handlers: EditorHandlers }` |

### handlers 命令说明

默认插槽提供的 `handlers` 是一组命令处理函数，每个 handler 包含以下方法：

| 方法                         | 说明                                                  |
| ---------------------------- | ----------------------------------------------------- |
| `canExecute(editor, cmd?)`   | 当前是否可执行该命令                                  |
| `execute(editor, cmd?)`      | 执行命令，返回一个 Tiptap chain，需调用 `.run()` 生效 |
| `isActive(editor, cmd?)`     | 当前选区是否处于该状态（用于按钮高亮）                |
| `isDisabled?.(editor, cmd?)` | 当前是否被禁用                                        |

常用 handler 包括：`bold`、`italic`、`underline`、`strike`、`code`、`heading`、`paragraph`、`bulletList`、`orderedList`、`taskList`、`blockquote`、`codeBlock`、`horizontalRule`、`link`、`image`、`textAlign`、`textColor`、`highlight`、`undo`、`redo`、`clearFormatting`、`mention`、`insertTable` 及表格行列操作等。

### 用法示例

```vue
<template>
  <xy-rich-text-editor v-model="content" placeholder="请输入...">
    <template #default="{ editor, handlers }">
      <button
        v-if="editor"
        :class="{ active: handlers.bold.isActive(editor) }"
        @click="handlers.bold.execute(editor).run()"
      >
        B
      </button>
    </template>
  </xy-rich-text-editor>
</template>
```

---

### RichTextEditorToolbar Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| editor | Tiptap Editor 实例（必填） | Editor | - |
| items | 工具栏 items 配置数组，支持一维或二维（二维会被分组渲染，组间渲染分隔符） | `EditorToolbarItem[]` \| `EditorToolbarItem[][]` | - |
| layout | 布局模式：`fixed` 内嵌固定 / `bubble` 选区浮窗 / `floating` 空段浮窗 | `'fixed'` \| `'bubble'` \| `'floating'` | `'fixed'` |
| as | 工具栏根元素标签或组件 | string \| object | `'div'` |
| color | 默认按钮颜色 | string | `'neutral'` |
| variant | 默认按钮变体 | string | `'ghost'` |
| activeColor | 激活态按钮颜色 | string | `'primary'` |
| activeVariant | 激活态按钮变体 | string | `'soft'` |
| size | 按钮尺寸 | `'sm'` \| `'md'` \| `'lg'` | `'sm'` |
| options | BubbleMenu/FloatingMenu 的浮动 UI 配置（透传给 tiptap 的对应组件） | object | `{ offset: 8, shift: { padding: 8 } }` |
| shouldShow | 控制 BubbleMenu/FloatingMenu 的显式时机，透传给 tiptap 的对应组件 | `(ctx: { editor, view, state, oldState? }) => boolean` | - |

#### EditorToolbarItem 类型

| 类型 | 说明 |
| --- | --- |
| Button | 普通按钮，含 `label` / `icon` / `tooltip` / `active` / `disabled` / `onClick` / `kind`（绑定 handler）等字段 |
| Dropdown | 下拉按钮，含 `items`（支持嵌套 separator/label/button） |
| Separator | 分隔符，`{ type: 'separator' }` |
| Label | 纯文本标签，`{ type: 'label', label }` |

### RichTextEditorToolbar Slots

| 插槽名 | 说明 | 插槽参数 |
| --- | --- | --- |
| item | 自定义 item 渲染（可通过 item.slot 指定别名） | `{ item, index, isActive, isDisabled, onClick }` |

### RichTextEditorToolbar 全局导出

```ts
import { defaultToolbarItems } from 'xiaoye-ui/rich-text-editor';
```

`defaultToolbarItems` 是预置的 7 组完整工具栏配置（含 40+ lucide SVG 图标），可直接传给 `items` prop。

---

### RichTextEditorDragHandle Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| editor | Tiptap Editor 实例（必填） | Editor | - |
| icon | 自定义拖拽图标（SVG 字符串） | string | 内置 grip 图标 |
| color | 按钮颜色 | string | `'neutral'` |
| variant | 按钮变体（`ghost`/`solid`/`outline`/`link`/`soft`） | string | `'ghost'` |
| size | 按钮尺寸（`xs`/`sm`/`md`/`lg`/`xl`，内部映射到 XYButton） | string | `'sm'` |
| options | Floating UI 配置 | FloatingUIOptions | 内置默认偏移 |
| pluginKey | 插件 key | string \| PluginKey | - |
| nested | 是否启用嵌套模式 | boolean | - |
| nestedOptions | 嵌套模式配置 | object | - |
| onElementDragEnd | 拖拽结束回调 | `(e: DragEvent) => void` | - |
| onElementDragStart | 拖拽开始回调 | `(e: DragEvent) => void` | - |
| getReferencedVirtualElement | 自定义参考元素 | `() => VirtualElement \| null` | - |

> 注：`variant` 与 `size` 内部会做映射。`variant` 的 `ghost`/`soft` → `text`，`solid` → `primary`，`outline` → `default`，`link` → `link`；`size` 的 `xs`/`sm` → `small`，`md` → `middle`，`lg`/`xl` → `large`。

### RichTextEditorDragHandle Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| hover | 鼠标 hover 到节点时触发 | `(payload: { node: JSONContent, pos: number })` |
| nodeChange | 点击拖拽手柄时触发（同时会调用 `setNodeSelection`） | `(payload: { node: JSONContent, pos: number })` |

### RichTextEditorDragHandle Slots

| 插槽名 | 说明 | 插槽参数 |
| --- | --- | --- |
| default | 自定义拖拽手柄渲染内容 | `{ classes: Record<string, string>, onClick: () => { node, pos } \| undefined }` |

---

### RichTextEditorMentionMenu Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| editor | Tiptap Editor 实例（必填） | Editor | - |
| items | 提及项数组，支持一维或二维 | `EditorMentionMenuItem[] \| EditorMentionMenuItem[][]` | - |
| char | 触发字符 | string | `'@'` |
| pluginKey | 插件 key | string | `'mentionMenu'` |
| filterFields | 过滤字段（默认对 label 过滤） | string[] | `['label']` |
| ignoreFilter | 关闭内置过滤（用于异步加载） | boolean | - |
| limit | 限制返回条数 | number | - |
| options | Floating UI 配置 | object | - |
| suggestion | Tiptap Suggestion 配置（覆盖内部默认） | object | - |
| appendTo | 菜单挂载容器 | `HTMLElement \| (() => HTMLElement)` | - |
| searchTerm (v-model:search-term) | 当前搜索词（用于异步加载） | string | `''` |

#### EditorMentionMenuItem 字段

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| label | 显示文本（必填） | string |
| description | 描述文本（次要展示） | string |
| icon | 前置图标（字符串/VNode/组件） | string \| VNode \| Component |
| avatar | 前置头像配置（自动渲染 `xy-avatar`） | `{ src?, image?, label?, icon?, shape?, size?, loading? }` |
| disabled | 是否禁用 | boolean |
| class | 自定义 class | any |

### RichTextEditorMentionMenu Events

| 事件名            | 说明                        | 回调参数          |
| ----------------- | --------------------------- | ----------------- |
| update:searchTerm | 搜索词变化时触发（v-model） | `(value: string)` |

---

### RichTextEditorEmojiMenu Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| editor | Tiptap Editor 实例（必填） | Editor | - |
| items | emoji 项数组，支持一维或二维 | `EmojiMenuItem[] \| EmojiMenuItem[][]` | - |
| char | 触发字符 | string | `':'` |
| pluginKey | 插件 key | string | `'emojiMenu'` |
| filterFields | 过滤字段 | string[] | `['name', 'shortcodes', 'tags']` |
| limit | 限制返回条数 | number | - |
| options | Floating UI 配置 | object | - |
| suggestion | Tiptap Suggestion 配置（覆盖内部默认） | object | - |
| appendTo | 菜单挂载容器 | `HTMLElement \| (() => HTMLElement)` | - |
| layout | 布局模式：`list` 列表 / `grid` 8 列网格 | `'list'` \| `'grid'` | `'grid'` |

#### EmojiMenuItem 字段

| 字段       | 说明                            | 类型     |
| ---------- | ------------------------------- | -------- |
| name       | 名称（必填，用于过滤）          | string   |
| emoji      | 实际插入的 emoji 字符           | string   |
| shortcodes | 短码列表（用于过滤）            | string[] |
| tags       | 标签列表（用于过滤）            | string[] |
| group      | 分组名称（用于二维 items 分组） | string   |

---

### RichTextEditorSuggestionMenu Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| editor | Tiptap Editor 实例（必填） | Editor | - |
| items | 菜单项数组，支持一维或二维 | `EditorSuggestionMenuItem[] \| EditorSuggestionMenuItem[][]` | - |
| char | 触发字符 | string | `'/'` |
| pluginKey | 插件 key | string | `'suggestionMenu'` |
| filterFields | 过滤字段 | string[] | `['label']` |
| limit | 限制返回条数 | number | `42` |
| options | Floating UI 配置 | object | - |
| suggestion | Tiptap Suggestion 配置（覆盖内部默认） | object | - |
| appendTo | 菜单挂载容器 | `HTMLElement \| (() => HTMLElement)` | - |

#### EditorSuggestionMenuItem 类型

| 类型 | 说明 |
| --- | --- |
| Action | 命令项，含 `label` / `description` / `icon` / `disabled` / `kind`（绑定 handler）等字段 |
| Label | 纯文本标签，`{ type: 'label', label }` |
| Separator | 分隔符，`{ type: 'separator' }` |

---

### EditorLinkPopover Props

| 属性     | 说明                                           | 类型    | 默认值  |
| -------- | ---------------------------------------------- | ------- | ------- |
| editor   | Tiptap Editor 实例（必填）                     | Editor  | -       |
| autoOpen | 是否自动打开（变为 true 时打开，false 时关闭） | boolean | `false` |

### EditorLinkPopover Events

| 事件名 | 说明           | 回调参数 |
| ------ | -------------- | -------- |
| open   | popover 打开时 | -        |
| close  | popover 关闭时 | -        |

### EditorLinkPopover Expose

| 方法名 | 说明             | 参数 |
| ------ | ---------------- | ---- |
| open   | 手动打开 popover | -    |
| close  | 手动关闭 popover | -    |

---

## FAQ

### `contentType` 不设置时会怎样？

组件会根据 `modelValue` 自动推断：字符串视为 `html`，其他视为 `json`。如需输出 Markdown，需显式设置 `contentType="markdown"` 并配合 `markdown` 扩展。

### 如何关闭某个扩展？

将对应属性设为 `false` 即可。例如 `:image="false"` 关闭图片扩展，`:table="false"` 关闭表格扩展。

### 修改扩展配置后为什么不生效？

Tiptap 编辑器实例在创建时确定扩展配置，运行时无法热更新。需要通过 `:key` 重建编辑器实例（参考「扩展配置」示例）。

### 如何自定义代码块主题？

通过 `codeBlockShiki` 对象配置 `defaultTheme` 与 `themes`。注意同时设置 `:starter-kit="{ codeBlock: false }"` 以禁用内置代码块，避免与 Shiki 冲突。

### Bubble/Floating 工具栏不显示？

检查以下几项：

1. `layout` 是否设置为 `'bubble'` 或 `'floating'`；
2. `editor` 是否已传入且非空；
3. 如使用 `shouldShow` 自定义显示逻辑，确认返回值正确；
4. BubbleMenu 默认仅在选中文本（非空选区）时显示；FloatingMenu 默认仅在空段落时显示。

### DragHandle 的 `hover` 与 `nodeChange` 事件区别？

- `hover`：鼠标 hover 到节点时触发（高频）；
- `nodeChange`：用户点击拖拽手柄时触发（低频），同时会调用 `editor.chain().setNodeSelection(pos).run()` 选中节点。

如需实现「点击弹出 dropdown 菜单」效果，监听 `nodeChange` 事件即可。

### MentionMenu 异步加载如何实现？

1. 用 `v-model:search-term` 绑定搜索词；
2. 监听该值变化，发起异步请求获取 items；
3. 设置 `:ignore-filter="true"` 关闭内置过滤（因为异步结果已是过滤后的）。

### EmojiMenu 的 grid 布局列数能改吗？

目前 grid 布局固定为 8 列（通过 `xy-rich-text-editor-emoji-menu-group--grid` 类控制）。如需自定义，可通过覆盖该类的 `grid-template-columns` 样式实现。
