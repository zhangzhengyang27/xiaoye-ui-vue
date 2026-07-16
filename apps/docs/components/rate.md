# Rate 评分

评分组件。

## 何时使用

- 对评价进行展示。
- 对事物进行快速的评级操作。

## 基本用法

:::demo 最简单的用法。

rate/basic

:::

## 半星

:::demo 支持选中半星。

rate/half

:::

## 文案展现

:::demo 给评分组件加上文案展示。

rate/text

:::

## 只读

:::demo 只读，无法进行鼠标交互。

rate/disabled

:::

## 清除

:::demo 支持允许或者禁用清除。

rate/clear

:::

## 其他字符

:::demo 可以将星星替换为其他字符，比如字母，数字，字体图标甚至中文。

rate/character

:::

## API

|  属性            |  说明                    |  类型            |  默认值              |
| -------------- | ---------------------- | -------------- | ------------------ |
|  allowClear      |  是否允许再次点击后清除  |  boolean         |  true                |
|  allowHalf       |  是否允许半选            |  boolean         |  false               |
|  autofocus       |  自动获取焦点            |  boolean         |  false               |
|  character       |  自定义字符              |  string \ |  slot  |  `<StarOutlined />`  |
|  count           |  star 总数               |  number          |  5                   |
|  disabled        |  只读，无法进行交互      |  boolean         |  false               |
|  tooltips        |  自定义每项的提示信息    |  string[]        |  -                   |
|  value(v-model)  |  当前数，受控值          |  number          |  -                   |

### 事件

|  事件名称     |  说明                      |  回调参数                 |       |
| ----------- | ------------------------ | ----------------------- | --- |
|  blur         |  失去焦点时的回调          |  Function()               |  -    |
|  change       |  选择时的回调              |  Function(value: number)  |  -    |
|  focus        |  获取焦点时的回调          |  Function()               |  -    |
|  hoverChange  |  鼠标经过时数值变化的回调  |  Function(value: number)  |  -    |
|  keydown      |  按键回调                  |  Function(event)          |  -    |

## 方法

|  名称     |  描述      |
| ------- | -------- |
|  blur()   |  移除焦点  |
|  focus()  |  获取焦点  |
