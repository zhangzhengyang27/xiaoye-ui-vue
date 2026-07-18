# InlineEdit 行内编辑

行内编辑组件，点击文字即可切换到编辑模式，输入完成后通过 Enter 保存、Esc 取消，支持点击外部保存与自动保存。

## 何时使用

- 需要在同一位置进行"展示—编辑"切换的场景，例如表格、卡片标题、详情页字段的快速编辑。
- 希望在不弹出额外弹层的情况下，提供轻量、即点即编辑的能力。
- 需要支持键盘（Enter/Space 进入编辑、Enter 保存、Esc 取消）与无障碍访问。

## 基础用法

:::demo 通过 `v-model` 绑定当前值，点击文字进入编辑模式。Enter 保存，Esc 取消，点击组件外部会自动保存。

inline-edit/basic

:::

## 多行文本

:::demo 设置 `type="textarea"` 使用多行文本输入。此时 Enter 默认换行，使用 `Ctrl/Shift/Cmd + Enter` 触发保存。

inline-edit/text-area

:::

## 数字编辑

:::demo 设置 `type="number"` 编辑数字，保存时会自动将字符串归一化为 `number` 类型。

inline-edit/number

:::

## 自动保存

:::demo 设置 `autoSave` 后，每次输入即触发 `change` 与 `save`，并保留编辑态。适合需要实时持久化的场景。

inline-edit/auto-save

:::

## 禁用状态

:::demo 设置 `disabled` 后，展示区不再响应点击与键盘事件，无法进入编辑模式。

inline-edit/disabled

:::

## 受控编辑态

:::demo 通过 `v-model:editable` 在外部控制编辑状态，可配合按钮主动进入或退出编辑。

inline-edit/controlled

:::

## API

### InlineEdit

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| modelValue(v-model) | 当前值，支持 `v-model` | string \| number | - |  |
| type | 输入类型 | `'text' \| 'number' \| 'textarea'` | `'text'` |  |
| disabled | 是否禁用，禁用后无法进入编辑模式 | boolean | `false` |  |
| placeholder | 占位符：展示区为空时显示，编辑模式传入输入框 | string | - |  |
| editable(v-model:editable) | 是否处于编辑状态，支持 `v-model:editable` | boolean | `false` |  |
| autoSave | 自动保存：每次输入变化即触发 `change` 与 `save`，并保留编辑态 | boolean | `false` |  |
| prefixCls | 自定义类名前缀 | string | `xy-inline-edit` |  |

### InlineEdit 事件

| 事件名称          | 说明                               | 回调参数                | 版本 |
| ----------------- | ---------------------------------- | ----------------------- | ---- |
| update:modelValue | 值变化时触发（保存时若值发生改变） | function(value)         |      |
| update:editable   | 编辑状态变化时触发                 | function(boolean)       |      |
| change            | 值变化时触发（仅当值与原值不同时） | function(value)         |      |
| save              | 保存时触发                         | function(value)         |      |
| cancel            | 取消时触发，回调参数为原值         | function(originalValue) |      |
| edit              | 进入编辑模式时触发                 | function(event)         |      |

### InlineEdit 方法

| 名称     | 说明                   | 版本 |
| -------- | ---------------------- | ---- |
| edit()   | 主动进入编辑模式       |      |
| save()   | 主动保存并退出编辑模式 |      |
| cancel() | 主动取消并退出编辑模式 |      |

### InlineEdit 插槽

| 插槽名  | 说明                                           | 参数                    | 版本 |
| ------- | ---------------------------------------------- | ----------------------- | ---- |
| default | 自定义展示区内容                               | { value, editable }     |      |
| edit    | 自定义编辑区内容（不渲染默认编辑器与操作按钮） | { value, save, cancel } |      |

## 设计说明

- 组件标签统一使用 `xy-` 前缀：`xy-inline-edit`。
- 编辑模式下：
  - `type="text"` / `type="number"` 渲染 `xy-input`；Enter 保存，Esc 取消。
  - `type="textarea"` 渲染 `xy-textarea`；Enter 换行，`Ctrl/Shift/Cmd + Enter` 保存，Esc 取消。
- 点击组件外部区域会自动保存当前值；按 `Esc` 取消编辑并还原原值。
- `autoSave=true` 时，每次输入都会触发 `change` 与 `save`，并保留编辑态以便持续编辑。
- 数字类型在保存时会自动归一化为 `number` 类型；空字符串保持为空。
- 组件支持 SSR，文档级事件监听仅在客户端注册。
- 焦点管理：进入编辑模式后会自动聚焦到编辑器；退出后焦点会回到展示区。
