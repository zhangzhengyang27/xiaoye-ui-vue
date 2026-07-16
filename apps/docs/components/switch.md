# Switch 开关

开关选择器。

## 何时使用

- 需要表示开关状态/两种状态之间的切换时；
- 和 `checkbox` 的区别是，切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。

## 基本用法

:::demo 最简单的用法。

switch/basic

:::

## 不可用

:::demo Switch 失效状态。

switch/disabled

:::

## 文字和图标

:::demo 带有文字和图标。

switch/text

:::

## 两种大小

:::demo `size="small"` 表示小号开关。

switch/size

:::

## 加载中

:::demo 标识开关操作仍在执行中。

switch/loading

:::

## API

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  autofocus  |  组件自动获取焦点  |  boolean  |  false  |    |
|  checked(v-model)  |  指定当前是否选中  |  checkedValue \ |  unCheckedValue  |  false  |    |
|  checkedChildren  |  选中时的内容  |  string\ | slot  |    |    |
|  checkedValue  |  选中时的值  |  boolean \ |  string \ |  number  |  true  |  2.2.1  |
|  disabled  |  是否禁用  |  boolean  |  false  |    |
|  loading  |  加载中的开关  |  boolean  |  false  |    |
|  size  |  开关大小，可选值：`default` `small`  |  string  |  default  |    |
|  unCheckedChildren  |  非选中时的内容  |  string\ | slot  |    |    |
|  unCheckedValue  |  非选中时的值  |  boolean \ |  string \ |  number  |  false  |  2.2.1  |

### 事件

|  事件名称  |  说明            |  回调参数                                                      |       |
| -------- | -------------- | ------------------------------------------------------------ | --- |
|  change    |  变化时回调函数  |  Function(checked: boolean \ |  string \ |  number, event: Event)  |       |
|  click     |  点击时回调函数  |  Function(checked: boolean \ |  string \ |  number, event: Event)  |       |

## 方法

|  名称     |  描述      |
| ------- | -------- |
|  blur()   |  移除焦点  |
|  focus()  |  获取焦点  |
