# Collapse 折叠面板

可以折叠/展开的内容区域。

## 何时使用

- 对复杂区域进行分组和隐藏，保持页面的整洁。
- '手风琴' 是一种特殊的折叠面板，只允许单个内容区域展开。

## 折叠面板

:::demo 可以同时展开多个面板，这个例子默认展开了第一个。

collapse/basic

:::

## 手风琴

:::demo 手风琴，每次只打开一个 tab。

collapse/accordion

:::

## 面板嵌套

:::demo 嵌套折叠面板。

collapse/mix

:::

## 简洁风格

:::demo 一套没有边框的简洁样式。

collapse/borderless

:::

## 自定义面板

:::demo 自定义各个面板的背景色、圆角、边距和图标。

collapse/custom

:::

## 隐藏箭头

:::demo 你可以通过 `:showArrow="false"` 隐藏 `a-collapse-panel` 组件的箭头图标。

collapse/noarrow

:::

## 额外节点

:::demo 可以同时展开多个面板，这个例子默认展开了第一个。

collapse/extra

:::

## 幽灵折叠面板

:::demo 将折叠面板的背景变成透明。

collapse/ghost

:::

## 可折叠触发区域

:::demo 通过 `collapsible` 属性，可以设置面板的可折叠触发区域。

collapse/collapsible

:::

## API

### Collapse

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  accordion  |  手风琴模式，始终只有一个面板处在激活状态  |  boolean  |  `false`  |    |
|  activeKey(v-model)  |  当前激活 tab 面板的 key  |  string\[] \ |  string <br> number\[] \ |  number  |  默认无，[手风琴模式](#components-collapse-demo-accordion)下默认第一个元素  |    |
|  bordered  |  带边框风格的折叠面板  |  boolean  |  `true`  |    |
|  collapsible  |  所有子面板是否可折叠或指定可折叠触发区域  |  `header` \ |  `icon` \ |  `disabled`  |  -  |  4.0  |
|  destroyInactivePanel  |  销毁折叠隐藏的面板  |  boolean  |  `false`  |    |
|  expandIcon  |  自定义切换图标  |  Function(props):VNode \ |  slot="expandIcon" slot-scope="props"\ | #expandIcon="props"  |    |    |
|  expandIconPosition  |  设置图标位置  |  `start` \ |  `end`  |  -  |  4.0  |
|  ghost  |  使折叠面板透明且无边框  |  boolean  |  false  |  3.0  |

### 事件

|  事件名称  |  说明            |  回调参数       |  版本  |
| -------- | -------------- | ------------- | ---- |
|  change    |  切换面板的回调  |  function(key)  |        |

### Collapse.Panel

|  参数         |  说明                            |  类型                    |  默认值  |  版本   |
| ----------- | ------------------------------ | ---------------------- | ------ | ----- |
|  collapsible  |  是否可折叠或指定可折叠触发区域  |  `header` \ |  `disabled`  |  -       |  3.0    |
|  extra        |  自定义渲染每个面板右上角的内容  |  VNode \ |  slot           |  -       |  1.5.0  |
|  forceRender  |  被隐藏时是否渲染 DOM 结构       |  boolean                 |  false   |         |
|  header       |  面板头内容                      |  string\ | slot            |  -       |         |
|  key          |  对应 activeKey                  |  string \ |  number        |  -       |         |
|  showArrow    |  是否展示当前面板上的箭头        |  boolean                 |  `true`  |         |
