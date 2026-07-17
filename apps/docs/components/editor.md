# Editor 富文本编辑器

基于 [Quill](https://quilljs.com/) 的富文本编辑器组件，内置工具栏，支持加粗、斜体、列表、链接、颜色等常见格式，并提供自定义工具栏与事件回调。

## 何时使用

- 需要所见即所得的富文本编辑场景（如文章编辑、评论、邮件正文）。
- 表单中需要采集 HTML 富文本内容的场景。
- 需要自定义工具栏按钮、限制可用格式的场景。

## 基础用法

:::demo 使用 `v-model` 绑定 HTML 字符串。组件内置完整工具栏，支持标题、字体、加粗、列表、对齐、颜色、链接、图片、代码块等格式。

editor/basic

:::

## 只读模式

:::demo 设置 `readonly` 属性后，编辑器内容不可修改，常用于内容预览场景。可通过响应式变量动态切换。

editor/readonly

:::

## 自定义工具栏

:::demo 通过 `#toolbar` 插槽可完全自定义工具栏，仅保留需要的格式按钮。按钮需使用 Quill 的 `ql-*` 类名以绑定对应行为。

editor/toolbar

:::

## 占位文本

:::demo 通过 `placeholder` 属性设置空内容时的占位提示。当编辑器内容为空时显示占位文本，输入内容后自动消失。

editor/placeholder

:::

## 事件处理

:::demo Editor 提供 `load`、`text-change`、`selection-change` 等事件，可用于监听编辑器加载、内容变更与选区变化。下方日志面板会实时记录触发的事件。

editor/events

:::

## API

### Editor Props

| 属性                 | 说明                                        | 类型     | 默认值  |
| -------------------- | ------------------------------------------- | -------- | ------- |
| modelValue (v-model) | 当前 HTML 值                                | string   | -       |
| defaultValue         | 非受控模式下的默认值                        | string   | -       |
| placeholder          | 空内容时显示的占位文本                      | string   | `null`  |
| readonly             | 是否只读                                    | boolean  | `false` |
| invalid              | 是否为无效状态                              | boolean  | `false` |
| formats              | 允许的格式白名单，详见 Quill 文档           | string[] | -       |
| editorStyle          | 编辑器内容区的内联样式                      | object   | -       |
| modules              | Quill 模块配置，会与默认 `toolbar` 配置合并 | object   | -       |

### Editor Events

| 事件名            | 说明                     | 回调参数                                  |
| ----------------- | ------------------------ | ----------------------------------------- |
| update:modelValue | `v-model` 同步事件       | `(value: string) => void`                 |
| value-change      | 内容变化时触发           | `(value: string) => void`                 |
| text-change       | 文本变化时触发           | `(e: EditorTextChangeEvent) => void`      |
| selection-change  | 选区变化时触发           | `(e: EditorSelectionChangeEvent) => void` |
| load              | Quill 实例加载完成时触发 | `(e: EditorLoadEvent) => void`            |

### Editor Slots

| 插槽名  | 说明                                          | 参数 |
| ------- | --------------------------------------------- | ---- |
| toolbar | 自定义工具栏内容，需使用 Quill 的 `ql-*` 类名 | -    |

### 事件载荷类型

```ts
interface EditorTextChangeEvent {
  htmlValue: string; // 当前 HTML 值
  textValue: string; // 当前纯文本
  delta: any; // Quill 变更描述
  source: string; // 变更来源：'user' | 'api'
  instance: any; // Quill 实例
}

interface EditorSelectionChangeEvent {
  htmlValue: string;
  textValue: string;
  range: any; // 当前选区
  oldRange: any; // 上一次选区
  source: string;
  instance: any;
}

interface EditorLoadEvent {
  instance: any; // Quill 实例
}
```

## FAQ

### 为什么工具栏按钮没有样式？

Editor 依赖 Quill 的 `quill.snow.css` 主题样式。组件内部会在运行时动态加载该样式，请确保项目环境允许加载 `quill/dist/quill.snow.css`。

### 如何获取 Quill 实例进行高级操作？

监听 `load` 事件，回调参数中的 `instance` 即为 Quill 实例，可通过它调用 `getContents`、`setContents`、`format` 等方法。

### 自定义工具栏按钮如何绑定行为？

使用 `#toolbar` 插槽，并按 Quill 工具栏约定添加 `<button class="ql-bold">`、`<select class="ql-header">` 等元素，Quill 会自动绑定对应行为。
