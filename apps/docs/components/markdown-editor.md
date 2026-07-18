# MarkdownEditor Markdown 编辑器

基于 [Vditor](https://github.com/Vanessa219/vditor) 的 Markdown 编辑器组件，支持三种编辑模式：

- **即时渲染（ir）**：类似 Typora，输入 Markdown 后立即渲染为富文本样式（默认）
- **所见即所得（wysiwyg）**：对不熟悉 Markdown 的用户友好
- **分屏预览（sv）**：左侧 Markdown 源码、右侧预览，适合大屏

支持 CommonMark、GFM、数学公式、Mermaid 图表、代码高亮、表情、@提及等扩展语法，并提供多语言、多主题、CDN 自定义等能力。

## 何时使用

- 需要 Markdown 编辑场景（如文档编辑、博客写作、评论、笔记应用）。
- 需要即时渲染、所见即所得、分屏预览等多种编辑模式切换的场景。
- 表单中需要采集 Markdown 源码或渲染后 HTML 内容的场景。
- 需要数学公式、流程图、代码高亮、表情等扩展语法的场景。

## 基础用法

:::demo 使用 `v-model` 绑定 Markdown 字符串。默认 `valueFormat` 为 `'markdown'`，即绑定值为 Markdown 源码。

markdown-editor/basic

:::

## 非受控模式

:::demo 使用 `default-value` 设置初始内容，不绑定 `v-model`，组件内部管理状态。父组件通过 `ref.getValue()` 主动读取，适合不需要实时同步的场景，性能更优。

markdown-editor/uncontrolled

:::

## 只读模式

:::demo 设置 `readonly` 属性后，编辑器内容不可修改，常用于内容预览场景。可通过响应式变量动态切换。

markdown-editor/readonly

:::

## 预览模式

:::demo 通过 `readonly` + `v-model` 组合实现「编辑区 + 预览区」联动，适合内容详情页、评论渲染等场景。关闭「同步预览」开关可冻结下方内容，便于对比修改前后效果。

markdown-editor/preview

:::

## 编辑模式切换

:::demo 通过 `mode` 属性切换编辑模式：`ir`（即时渲染）、`wysiwyg`（所见即所得）、`sv`（分屏预览）。

markdown-editor/mode

:::

## 值格式切换

:::demo 通过 `valueFormat` 属性切换 `v-model` 绑定值的格式：`'markdown'` 返回 Markdown 源码，`'html'` 返回渲染后的 HTML。

markdown-editor/value-format

:::

## 主题切换

:::demo 通过 `theme` 属性切换浅色（classic）/深色（dark）主题，配合 `typewriterMode`（打字机模式）和 `debug`（调试日志）开关。切换时通过 `:key` 强制重建实例；如需不重建实例动态切换，可通过 `ref` 调用 `setTheme()` 方法。

markdown-editor/theme

:::

## 自定义工具栏

:::demo 通过 `toolbar` 属性自定义工具栏按钮。元素可以是字符串（内置按钮 name）或对象（自定义按钮）。可用 name 参见 [Vditor 文档](https://ld246.com/article/1582778815353)。

markdown-editor/toolbar

:::

## 图片上传

:::demo 通过 `upload` 属性配置图片上传。支持拖拽、粘贴、工具栏按钮三种触发方式。本示例使用 `handler` 自定义上传函数模拟异步上传，实际项目可配置 `url` 字段交给 Vditor 自动上传。

markdown-editor/upload

:::

## 计数器

:::demo 通过 `counter` 属性配置字数统计。`max` 达到上限时编辑器会阻止继续输入；`type` 可切换统计 `markdown` 源码字数或 `text` 纯文本字数。

markdown-editor/counter

:::

## 国际化

:::demo 通过 `lang` 属性切换编辑器界面语言（工具栏、提示、菜单等）。Vditor 内置 20+ 语言，切换时通过 `:key` 强制重建实例。

markdown-editor/i18n

:::

## 自定义渲染

:::demo 通过 `customRenders` 属性自定义特定语言代码块的渲染结果。每项配置 `{ language, render(element, vditor) }`，可在 `render` 中任意操作 DOM，集成 mermaid.js、流程图、广告位等。

markdown-editor/custom-renders

:::

## 事件处理

:::demo MarkdownEditor 提供 `input`、`focus`、`blur`、`keydown`、`esc`、`ctrlEnter`、`select`、`after` 等事件，可用于监听编辑器输入、焦点变化、按键等。下方日志面板会实时记录触发的事件。

markdown-editor/events

:::

## ref 方法调用

:::demo 通过 `ref` 调用编辑器暴露的方法，可在父组件中灵活控制编辑器实例：获取/设置内容、插入文本、禁用/启用、聚焦/失焦、清空 undo 栈、HTML 转 Markdown、编辑器内提示等。

markdown-editor/methods

:::

## 表单集成

:::demo `xy-markdown-editor` 可像普通表单控件一样与 `xy-form` + `xy-form-item` 集成，通过 `v-model` 绑定到 form model，提交时触发表单校验。

markdown-editor/form

:::

## CDN 配置

:::demo Vditor 默认从 unpkg CDN 加载子资源（表情、数学公式、代码高亮等）。通过 `cdn` 属性可自建 CDN 路径，适合离线或私有部署场景。

markdown-editor/cdn

:::

## API

### MarkdownEditor Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 绑定值，格式由 `valueFormat` 决定 | string | - |
| defaultValue | 非受控模式下的默认值 | string | `''` |
| valueFormat | 绑定值格式：`'markdown'` 返回源码，`'html'` 返回 HTML | `'markdown'` \| `'html'` | `'markdown'` |
| mode | 编辑模式 | `'ir'` \| `'wysiwyg'` \| `'sv'` | `'ir'` |
| placeholder | 空内容时显示的占位文本 | string | `''` |
| height | 编辑器总高度，支持数字（px）或字符串 | number \| string | `'auto'` |
| minHeight | 编辑区域最小高度（px） | number | - |
| width | 编辑器总宽度，支持数字（px）或字符串 | number \| string | `'auto'` |
| lang | 语言种类 | string | `'zh_CN'` |
| theme | 编辑器主题 | `'classic'` \| `'dark'` | `'classic'` |
| icon | 图标风格 | `'ant'` \| `'material'` | `'ant'` |
| readonly | 是否只读 | boolean | `false` |
| typewriterMode | 是否启用打字机模式 | boolean | `false` |
| debug | 是否显示日志 | boolean | `false` |
| cdn | CDN 地址，留空使用 Vditor 内置默认（unpkg） | string | `''` |
| tab | tab 键操作字符串 | string | `''` |
| toolbar | 工具栏配置，元素为 string 或 IMenuItem | Array<string \| IMenuItem> | - |
| toolbarConfig | 工具栏显示配置 | object | - |
| cache | 缓存配置 | object | - |
| counter | 计数器配置 | object | - |
| upload | 上传配置 | object | - |
| hint | 提示配置 | object | - |
| preview | 预览配置 | object | - |
| outline | 大纲配置 | object | - |
| resize | resize 配置 | object | - |
| comment | 评论配置 | object | - |
| customRenders | 自定义渲染器 | array | - |
| options | 透传 Vditor 完整 options，覆盖优先级最高 | object | - |
| editorStyle | 容器内联样式 | object | - |

### MarkdownEditor Events

| 事件名            | 说明                      | 回调参数                         |
| ----------------- | ------------------------- | -------------------------------- |
| update:modelValue | `v-model` 同步事件        | `(value: string) => void`        |
| input             | 输入后触发                | `(value: string) => void`        |
| focus             | 聚焦后触发                | `(value: string) => void`        |
| blur              | 失焦后触发                | `(value: string) => void`        |
| keydown           | 按下键盘触发              | `(event: KeyboardEvent) => void` |
| esc               | `esc` 按下后触发          | `(value: string) => void`        |
| ctrlEnter         | `⌘/ctrl+enter` 按下后触发 | `(value: string) => void`        |
| select            | 选中文字后触发            | `(value: string) => void`        |
| unSelect          | 未选中文字后触发          | `() => void`                     |
| after             | 编辑器异步渲染完成后触发  | `(instance: Vditor) => void`     |

### MarkdownEditor Methods（通过 ref 调用）

| 方法名       | 说明                  | 参数                                                    |
| ------------ | --------------------- | ------------------------------------------------------- |
| getVditor    | 获取 Vditor 原始实例  | -                                                       |
| getValue     | 获取 Markdown 源码    | -                                                       |
| getHTML      | 获取渲染后的 HTML     | -                                                       |
| setValue     | 设置 Markdown 内容    | `(value: string, clearStack?: boolean)`                 |
| insertValue  | 在焦点处插入内容      | `(value: string, render?: boolean)`                     |
| insertMD     | 在焦点处插入 Markdown | `(md: string)`                                          |
| disabled     | 禁用编辑器            | -                                                       |
| enable       | 启用编辑器            | -                                                       |
| setTheme     | 设置主题              | `(theme, contentTheme?, codeTheme?, contentThemePath?)` |
| setMode      | 切换编辑模式          | `(mode: 'ir' \| 'wysiwyg' \| 'sv')`                     |
| focus        | 聚焦                  | -                                                       |
| blur         | 失焦                  | -                                                       |
| getSelection | 获取选中文本          | -                                                       |
| clearStack   | 清空 undo/redo 栈     | -                                                       |
| tip          | 提示消息              | `(text: string, time?: number)`                         |
| html2md      | HTML 转 Markdown      | `(value: string)`                                       |

## FAQ

### 为什么编辑器加载需要联网？

Vditor 默认从 unpkg CDN 加载子资源（表情图片、数学公式引擎、代码高亮等）。如需离线使用，请通过 `cdn` 属性指定本地路径，参考「CDN 配置」示例。

### 如何获取 Vditor 实例进行高级操作？

通过 `ref` 调用 `getVditor()` 方法获取 Vditor 原始实例，或监听 `after` 事件，回调参数即为 Vditor 实例。可通过它调用 `exportJSON`、`renderPreview`、`getCursorPosition` 等方法。参考「ref 方法调用」示例。

### v-model 绑定的值是 Markdown 还是 HTML？

默认是 Markdown 源码。通过 `valueFormat="html"` 可切换为绑定渲染后的 HTML。两种格式都可通过 `getValue()` / `getHTML()` 方法显式获取。参考「值格式切换」示例。

### 如何在表单中使用？

像普通表单控件一样，配合 `xy-form` + `xy-form-item`，通过 `v-model` 绑定到 form model 字段即可。提交时调用 `formRef.validate()` 触发校验。参考「表单集成」示例。

### 如何实现纯预览（不可编辑）？

设置 `readonly` 属性即可。如需「编辑 + 预览」联动，可使用两个编辑器，通过 `v-model` 同步内容。参考「预览模式」示例。

### 如何自定义工具栏按钮？

通过 `toolbar` 属性传入数组，元素可以是字符串（内置按钮 name，如 `'emoji'`、`'bold'`、`'|'`（分隔符））或自定义按钮对象（需包含 `name`、`icon`、`click` 等字段）。参考「自定义工具栏」示例。

### 如何实现图片上传？

通过 `upload` 属性配置。可设置 `url` 字段让 Vditor 自动上传到后端接口，或通过 `handler` 自定义上传函数。支持拖拽、粘贴、工具栏按钮三种触发方式。参考「图片上传」示例。

### 受控模式与非受控模式的区别？

- **受控模式**：使用 `v-model` 双向绑定，父组件维护内容状态，适合需要实时同步的场景。
- **非受控模式**：使用 `default-value` 设置初始值，组件内部管理状态，父组件通过 `ref.getValue()` 主动读取，性能更优。

参考「基础用法」（受控）与「非受控模式」示例对比。
