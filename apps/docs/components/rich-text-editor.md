# RichTextEditor 富文本编辑器

基于 [Tiptap](https://tiptap.dev/) 的现代富文本编辑器，内置 StarterKit、图片、@提及、表格、代码块高亮、文本对齐、高亮标记、Markdown 等扩展，并可通过默认插槽自定义工具栏。

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

:::demo 下例展示了完整工具栏配置，涵盖标题、文本样式、列表、引用、代码块、分割线、链接、撤销重做、清除格式等操作，可按需裁剪。

rich-text-editor/toolbar

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

## FAQ

### `contentType` 不设置时会怎样？

组件会根据 `modelValue` 自动推断：字符串视为 `html`，其他视为 `json`。如需输出 Markdown，需显式设置 `contentType="markdown"` 并配合 `markdown` 扩展。

### 如何关闭某个扩展？

将对应属性设为 `false` 即可。例如 `:image="false"` 关闭图片扩展，`:table="false"` 关闭表格扩展。

### 修改扩展配置后为什么不生效？

Tiptap 编辑器实例在创建时确定扩展配置，运行时无法热更新。需要通过 `:key` 重建编辑器实例（参考「扩展配置」示例）。

### 如何自定义代码块主题？

通过 `codeBlockShiki` 对象配置 `defaultTheme` 与 `themes`。注意同时设置 `:starter-kit="{ codeBlock: false }"` 以禁用内置代码块，避免与 Shiki 冲突。
