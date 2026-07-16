# Statistic 统计数值

展示统计数值。

## 何时使用

- 当需要突出某个或某组数字时
- 当需要展示带描述的统计类数据时使用

## 基本用法

:::demo 简单展示

statistic/basic

:::

## 单位

:::demo 通过前缀和后缀添加单位。

statistic/unit

:::

## 在卡片中使用

:::demo 在卡片中展示统计数值。

statistic/card

:::

## 倒计时

:::demo 倒计时组件。

statistic/countdown

:::

## 倒计时组件

:::demo 倒计时组件使用插槽。

statistic/countdown-slot

:::

## API

### Statistic

|  参数              |  说明              |  类型                          |  默认值  |
| ---------------- | ---------------- | ---------------------------- | ------ |
|  decimalSeparator  |  设置小数点        |  string                        |  .       |
|  formatter         |  自定义数值展示    |  v-slot \ |  (\{value\}) => VNode  |  -       |
|  groupSeparator    |  设置千分位标识符  |  string                        |  ,       |
|  precision         |  数值精度          |  number                        |  -       |
|  prefix            |  设置数值的前缀    |  string \ |  v-slot              |  -       |
|  suffix            |  设置数值的后缀    |  string \ |  v-slot              |  -       |
|  title             |  数值的标题        |  string \ |  v-slot              |  -       |
|  value             |  数值内容          |  string \ |  number              |  -       |
|  valueStyle        |  设置数值的样式    |  style                         |  -       |

### Statistic.Countdown

|  参数        |  说明                                                 |  类型              |  默认值      |
| ---------- | --------------------------------------------------- | ---------------- | ---------- |
|  format      |  格式化倒计时展示，参考 [dayjs](https://day.js.org/)  |  string            |  'HH:mm:ss'  |
|  prefix      |  设置数值的前缀                                       |  string \ |  v-slot  |  -           |
|  suffix      |  设置数值的后缀                                       |  string \ |  v-slot  |  -           |
|  title       |  数值的标题                                           |  string \ |  v-slot  |  -           |
|  value       |  数值内容                                             |  number \ |  dayjs   |  -           |
|  valueStyle  |  设置数值的样式                                       |  style             |  -           |

#### Statistic.Countdown 事件

|  事件名称  |  说明              |  回调参数    |
| -------- | ---------------- | ---------- |
|  finish    |  倒计时完成时触发  |  () => void  |
