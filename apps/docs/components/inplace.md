# Inplace 就地编辑

就地编辑组件，点击展示区即可切换到编辑模式，编辑完成后可点击关闭按钮或外部区域退出。

## 何时使用

- 需要在同一位置进行展示与编辑切换的场景，例如表格行内编辑、卡片标题编辑。
- 希望在不弹出额外弹层的情况下，提供轻量的编辑能力。
- 需要支持键盘（Enter/Space 进入编辑、Esc 退出）和无障碍访问。

## 基础用法

:::demo 通过 `v-model:active` 控制编辑状态，`#display` 插槽渲染展示内容，`#content` 插槽渲染编辑内容。

inplace/basic

:::

## 输入框编辑

:::demo 在 `#content` 插槽中放置输入框，配合 `closeCallback` 实现确认即退出。

inplace/with-input

:::

## 表单编辑

:::demo 结合 `xy-form` 实现就地表单编辑，提交后退出编辑状态。

inplace/with-form

:::

## 自定义触发

:::demo 通过 `displayToggleCallback` 拦截切换行为，实现条件触发；也可在 `#display` 插槽中自由组合内容。

inplace/custom-trigger

:::

## 禁用状态

:::demo 设置 `disabled` 后，展示区不再响应点击与键盘事件。

inplace/disabled

:::

## API

### Inplace

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| active(v-model) | 是否处于编辑状态 | boolean | `false` |  |
| disabled | 是否禁用，禁用后无法进入编辑模式 | boolean | `false` |  |
| closable | 编辑模式是否显示关闭按钮 | boolean | `true` |  |
| displayToggleCallback | 切换到编辑模式前的回调，返回 `false` 阻止切换 | function(event) => boolean \| void | - |  |

### Inplace 事件

| 事件名称      | 说明               | 回调参数          | 版本 |
| ------------- | ------------------ | ----------------- | ---- |
| open          | 进入编辑模式时触发 | function(event)   |      |
| close         | 退出编辑模式时触发 | function(event)   |      |
| update:active | 编辑状态变化时触发 | function(boolean) |      |

### Inplace 方法

| 名称    | 说明             | 版本 |
| ------- | ---------------- | ---- |
| open()  | 主动进入编辑模式 |      |
| close() | 主动退出编辑模式 |      |

### Inplace 插槽

| 插槽名  | 说明     | 参数                            | 版本 |
| ------- | -------- | ------------------------------- | ---- |
| display | 展示内容 | -                               |      |
| content | 编辑内容 | closeCallback: (event?) => void |      |

### InplaceDisplay

`XYInplace` 的展示子组件，也可独立使用。当处于 `XYInplace` 内部时，点击会自动触发父组件的 `open`；独立使用时会触发 `click` 事件。

| 参数      | 说明           | 类型   | 默认值       | 版本 |
| --------- | -------------- | ------ | ------------ | ---- |
| prefixCls | 自定义类名前缀 | string | `xy-inplace` |      |

### InplaceDisplay 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| click | 独立使用时点击触发（在 `XYInplace` 内部使用时不会触发，由父组件接管） | function(event) |  |

### InplaceContent

`XYInplace` 的内容子组件，也可独立使用。当处于 `XYInplace` 内部时，关闭按钮会自动触发父组件的 `close`；独立使用时会触发 `close` 事件。

| 参数      | 说明             | 类型    | 默认值       | 版本 |
| --------- | ---------------- | ------- | ------------ | ---- |
| prefixCls | 自定义类名前缀   | string  | `xy-inplace` |      |
| closable  | 是否显示关闭按钮 | boolean | `true`       |      |

### InplaceContent 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| close | 独立使用时点击关闭按钮触发（在 `XYInplace` 内部使用时不会触发，由父组件接管） | function(event) |  |

## 设计说明

- 组件标签统一使用 `xy-` 前缀：`xy-inplace`、`xy-inplace-display`、`xy-inplace-content`。
- 编辑模式下点击组件外部区域或按下 `Esc` 键可退出编辑。
- 关闭后焦点会自动还原到展示区，便于键盘连续操作。
- 组件支持 SSR，文档级事件监听仅在客户端注册。
