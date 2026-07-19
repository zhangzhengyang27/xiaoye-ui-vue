# ImageCompare 图片对比

用于并排对比两张图片的差异，常用于展示修图前后、设计稿对比等场景。

## 何时使用

- 需要直观对比两张图片的差异时。
- 需要让用户通过拖拽滑块查看对比结果时。

## 基础用法

:::demo 通过 `left` 和 `right` 插槽传入两张图片，即可使用默认的滑块进行对比。

image-compare/basic

:::

## 受控模式

:::demo 通过 `v-model:value` 控制滑块位置，实现受控对比。

image-compare/controlled

:::

## 禁用状态

:::demo 设置 `disabled` 后，滑块将不可拖动。

image-compare/disabled

:::

## 使用说明

### 受控与非受控

ImageCompare 同时支持受控与非受控两种使用方式：

- 非受控模式：仅设置 `defaultValue`，组件内部维护滑块位置。拖动滑块时会触发 `change` 事件。
- 受控模式：使用 `v-model:value`（即绑定 `value` 并监听 `update:value`），滑块位置完全由外部状态控制。

### defaultValue

`defaultValue` 用于指定滑块的初始位置，取值范围为 `0 ~ 100`，默认值为 `50`。该属性仅在非受控模式下生效；当提供 `value` 时，组件将进入受控模式，`defaultValue` 不再影响当前值。

### disabled

设置 `disabled` 后，滑块将不可交互，常用于只读展示场景。禁用状态下的样式由组件自动处理。

## API

通过设置 ImageCompare 的属性来控制对比行为。

### Props

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 当前滑块位置（受控值） | number | - |  |
| defaultValue | 默认滑块位置 | number | `50` |  |
| disabled | 是否禁用滑块交互 | boolean | `false` |  |
| onChange | 滑块值变化时的回调函数 | (value: number) => void | - |  |
| onUpdate:value | `value` 更新时的回调函数，配合 `v-model:value` 使用 | (value: number) => void | - |  |

### Events

| 事件名称     | 说明                   | 回调参数                | 版本 |
| ------------ | ---------------------- | ----------------------- | ---- |
| change       | 滑块值变化时触发       | (value: number) => void |      |
| update:value | 受控模式下同步值时触发 | (value: number) => void |      |

### Slots

| 插槽名称 | 说明                         | 参数 |
| -------- | ---------------------------- | ---- |
| left     | 左侧（通常作为“对比前”）内容 | -    |
| right    | 右侧（通常作为“对比后”）内容 | -    |

## Types

从 `xiaoye-ui/image-compare` 导出的 TypeScript 类型：

| 类型名 | 说明 | 定义 |
| --- | --- | --- |
| ImageCompareProps | ImageCompare 组件 Props 类型 | `Partial<ExtractPropTypes<ReturnType<typeof imageCompareProps>>>` |
