# Radio 单选框

单选框。

## 何时使用

- 用于在多个备选项中选中单个状态。
- 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

## 基本用法

:::demo 最简单的用法。

radio/basic

:::

## 不可用

:::demo Radio 不可用。

radio/disabled

:::

## 按钮样式

:::demo 按钮样式的单选组合。

radio/radioButton

:::

## 填底的按钮样式

:::demo 实色填底的单选按钮样式。

radio/radioButton-solid

:::

## RadioGroup 垂直

:::demo 垂直的 RadioGroup，配合更多输入框选项。

radio/radioGroup-more

:::

## RadioGroup 组合 - 配置方式

:::demo 通过配置 `options` 参数来渲染单选框。

radio/radioGroup-options

:::

## 单选组合 - 配合 name 使用

:::demo 可以为 Radio.Group 配置 `name` 参数，为组合内的 input 元素赋予相同的 `name` 属性，使浏览器把 Radio.Group 下的 Radio 真正看作是一组（例如可以通过方向键始终**在同一组内**更改选项）。

radio/radioGroup-with-name

:::

## 单选组合

:::demo 一组互斥的 Radio 配合使用。

radio/radioGroup

:::

## 大小

:::demo 大中小三种组合，可以和表单输入框进行对应配合。

radio/size

:::

## API

### Radio/Radio.Button

|  参数              |  说明                               |  类型     |  默认值  |
| ---------------- | --------------------------------- | ------- | ------ |
|  autofocus         |  自动获取焦点                       |  boolean  |  false   |
|  checked(v-model)  |  指定当前是否选中                   |  boolean  |  false   |
|  disabled          |  禁用 Radio                         |  boolean  |  false   |
|  value             |  根据 value 进行比较，判断是否选中  |  any      |  -       |

### RadioGroup

单选框组合，用于包裹一组 `Radio`。

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  buttonStyle  |  RadioButton 的风格样式，目前有描边和填色两种风格  |  `outline` \ |  `solid`  |  `outline`  |    |
|  disabled  |  禁选所有子单选器  |  boolean  |  false  |    |
|  name  |  RadioGroup 下所有 `input[type="radio"]` 的 `name` 属性  |  string  |  -  |    |
|  options  |  以配置形式设置子元素  |  string\[] \ |  number[] \ |  Array&lt;\{ label: string value: string disabled?: boolean \}>  |  -  |    |
|  optionType  |  用于设置 Radio `options` 类型  |  `default` \ |  `button`  |  `default`  |  3.0.0  |
|  size  |  大小，只对按钮样式生效  |  `large` \ |  `default` \ |  `small`  |  `default`  |    |
|  value(v-model)  |  用于设置当前选中的值  |  any  |  -  |    |

### RadioGroup 事件

|  事件名称  |  说明                  |  回调参数           |
| -------- | -------------------- | ----------------- |
|  change    |  选项变化时的回调函数  |  Function(e:Event)  |

## 方法

### Radio

|  名称     |  描述      |
| ------- | -------- |
|  blur()   |  移除焦点  |
|  focus()  |  获取焦点  |
