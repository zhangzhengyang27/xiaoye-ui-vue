# Checkbox 多选框

多选框。

## 何时使用

- 在一组可选项中进行多项选择时；
- 单独使用可以表示两种状态之间的切换，和 `switch` 类似。区别在于切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。

## 基本用法

:::demo 简单的 checkbox

checkbox/basic

:::

## 全选

:::demo 在实现全选效果时，你可能会用到 `indeterminate` 属性

checkbox/check-all

:::

## 受控的 checkbox

:::demo 联动checkbox

checkbox/controller

:::

## 不可用

:::demo checkbox 不可用

checkbox/disabled

:::

## Checkbox 组

:::demo 方便的从数组生成 checkbox

checkbox/group

:::

## 布局

:::demo Checkbox.Group 内嵌 Checkbox 并与 Grid 组件一起使用，可以实现灵活的布局

checkbox/layout

:::

## API

### 属性

#### Checkbox

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  autofocus  |  自动获取焦点  |  boolean  |  false  |    |
|  checked(v-model)  |  指定当前是否选中  |  boolean  |  false  |    |
|  disabled  |  失效状态  |  boolean  |  false  |    |
|  indeterminate  |  设置 indeterminate 状态，只负责样式控制  |  boolean  |  false  |    |
|  value  |  与 CheckboxGroup 组合使用时的值  |  boolean \ |  string \ |  number  |  -  |    |

#### 事件

|  事件名称  |  说明            |  回调参数           |  版本  |       |
| -------- | -------------- | ----------------- | ---- | --- |
|  change    |  变化时回调函数  |  Function(e:Event)  |  -     |       |

#### Checkbox Group

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  disabled  |  整组失效  |  boolean  |  false  |    |
|  name  |  CheckboxGroup 下所有 `input[type="checkbox"]` 的 `name` 属性  |  string  |  -  |  1.5.0  |
|  options  |  指定可选项，可以通过 slot="label" slot-scope="option" 定制`label`  |  string\[] \ |  Array&lt;\{ label: string value: string disabled?: boolean, indeterminate?: boolean, onChange?: function \}>  |  \[]  |    |
|  value(v-model)  |  指定选中的选项  |  (boolean \ |  string \ |  number)\[]  |  \[]  |    |

#### 事件

|  事件名称  |  说明            |  回调参数                |  版本  |       |
| -------- | -------------- | ---------------------- | ---- | --- |
|  change    |  变化时回调函数  |  Function(checkedValue)  |  -     |       |

### 方法

#### Checkbox

|  名称     |  描述      |  版本  |
| ------- | -------- | ---- |
|  blur()   |  移除焦点  |        |
|  focus()  |  获取焦点  |        |
