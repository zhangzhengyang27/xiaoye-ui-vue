# Space 间距

设置组件之间的间距。

## 何时使用

避免组件紧贴在一起，拉开统一的空间。

- 适合行内元素的水平间距。
- 可以设置各种水平对齐方式。
- 需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact（自 `xiaoye-ui@1.0.0` 版本开始提供该组件）。

## 基本用法

:::demo 相邻组件水平间距。

space/base

:::

## 分隔符

:::demo 相邻组件分隔符。

space/split

:::

## 自动换行

:::demo 自动换行。

space/wrap

:::

## 间距大小

:::demo 间距预设大、中、小三种大小。 通过设置 `size` 为 `large` `middle` 分别把间距设为大、中间距。若不设置 `size`，则间距为小。

space/size

:::

## 对齐

:::demo 设置对齐模式。

space/align

:::

## 自定义尺寸

:::demo 自定义间距大小。

space/customize

:::

## 垂直间距

:::demo 相邻组件垂直间距。 可以设置 `width: 100%` 独占一行。

space/vertical

:::

## 紧凑布局组合

:::demo 使用 Space.Compact 让表单组件之间紧凑连接且合并边框。

space/compact

:::

## Button 紧凑布局

:::demo Button 组件紧凑排列的示例。

space/compact-buttons

:::

## 垂直方向紧凑布局

:::demo 垂直方向的紧凑布局，目前仅支持 Button 组合。

space/compact-button-vertical

:::

## API

### Space

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  align  |  对齐方式  |  `start` \ |  `end` \ | `center` \ | `baseline`  |  -  |  1.6.5  |
|  direction  |  间距方向  |  `vertical` \ |  `horizontal`  |  `horizontal`  |  1.6.5  |
|  size  |  间距大小  |  `small` \ |  `middle` \ |  `large` \ |  `number`  |  `small`  |  1.6.5  |
|  split  |  设置拆分  |  VueNode \ |  v-slot  |  -  |  2.2.0  |
|  wrap  |  是否自动换行，仅在 `horizontal` 时有效  |  boolean  |  false  |  2.2.0  |

### Space.Compact

> 自 xiaoye-ui@1.0.0 版本开始提供该组件。

需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact。支持的组件有：

- Button
- AutoComplete
- Cascader
- DatePicker
- Input/Input.Search
- Select
- TimePicker
- TreeSelect

|  参数       |  说明                          |  类型                            |  默认值        |  版本   |
| --------- | ---------------------------- | ------------------------------ | ------------ | ----- |
|  block      |  将宽度调整为父元素宽度的选项  |  boolean                         |  false         |  4.0.0  |
|  direction  |  指定排列方向                  |  `vertical` \ |  `horizontal`      |  `horizontal`  |  4.0.0  |
|  size       |  子组件大小                    |  `large` \ |  `middle` \ |  `small`  |  `middle`      |  4.0.0  |
