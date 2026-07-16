# Timeline 时间轴

垂直展示的时间流信息。

## 何时使用

- 当有一系列信息需按时间排列时，可正序和倒序。
- 需要有一条时间轴进行视觉上的串联时。

## 基本用法

:::demo 基本的时间轴。

timeline/basic

:::

## 圆圈颜色

:::demo 圆圈颜色，绿色用于已完成、成功状态，红色表示告警或错误状态，蓝色可表示正在进行或其他默认状态。

timeline/color

:::

## 最后一个及排序

:::demo 当任务状态正在发生，还在记录过程中，可用幽灵节点来表示当前的时间节点，当 `pending` 为真值时展示幽灵节点，如果 `pending` 是 `VNode` 可用于定制该节点内容，同时 `pendingDot` 将可以用于定制其轴点。reverse 属性用于控制节点排序，为 false 时按正序排列，为 true 时按倒序排列。

timeline/pending

:::

## 自定义时间轴点

:::demo 可以设置为图标或其他自定义元素。

timeline/custom

:::

## 交替展现

:::demo 内容在时间轴两侧轮流出现。

timeline/alternate

:::

## 标签

:::demo 使用 `label` 标签单独展示时间。

timeline/label

:::

## 右侧时间轴点

:::demo 时间轴点可以在内容的右边。

timeline/right

:::

## API

```html
<a-timeline>
  <a-timeline-item>创建服务现场 2015-09-01</a-timeline-item>
  <a-timeline-item>初步排除网络异常 2015-09-01</a-timeline-item>
  <a-timeline-item>技术测试异常 2015-09-01</a-timeline-item>
  <a-timeline-item>网络异常正在修复 2015-09-01</a-timeline-item>
</a-timeline>
```

### Timeline

时间轴。

|  参数  |  说明  |  类型  |  默认值  |
| --- | --- | --- | --- |
|  mode  |  通过设置 `mode` 可以改变时间轴和内容的相对位置  |  `left` \ |  `alternate` \ |  `right`  |    |
|  pending  |  指定最后一个幽灵节点是否存在或内容  |  boolean\ | string\ | slot  |  false  |
|  pendingDot  |  当最后一个幽灵节点存在時，指定其时间图点  |  string\ | slot  |  `<LoadingOutlined />`  |
|  reverse  |  节点排序  |  boolean  |  false  |

### Timeline.Item

时间轴的每一个节点。

|  参数      |  说明                                             |  类型               |  默认值  |  版本  |
| -------- | ----------------------------------------------- | ----------------- | ------ | ---- |
|  color     |  指定圆圈颜色 `blue, red, green`，或自定义的色值  |  string             |  blue    |        |
|  dot       |  自定义时间轴点                                   |  string\ | slot       |  -       |        |
|  label     |  设置标签                                         |  string \ |  slot     |  -       |  3.0   |
|  position  |  自定义节点位置                                   |  `left` \ |  `right`  |  -       |        |
