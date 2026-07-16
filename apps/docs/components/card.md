# Card 卡片

通用卡片容器

## 何时使用

最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。

## 典型卡片

:::demo 包含标题、内容、操作区域。 可通过设置size为`default`或者`small`，控制尺寸

card/basic

:::

## 无边框

:::demo 在灰色背景上使用无边框的卡片

card/border-less

:::

## 更灵活的内容展示

:::demo 可以利用 `Card.Meta` 支持更灵活的内容

card/flexible-content

:::

## 网格型内嵌卡片

:::demo 一种常见的卡片内容区隔模式。

card/grid-card

:::

## 栅格卡片

:::demo 在系统概览页面常常和栅格进行配合。

card/in-column

:::

## 内部卡片

:::demo 可以放在普通卡片内部，展示多层级结构的信息

card/inner

:::

## 预加载的卡片

:::demo 数据读入前会有文本块样式

card/loading

:::

## 支持更多内容配置

:::demo 一种支持封面、头像、标题和描述信息的卡片。

card/meta

:::

## 简洁卡片

:::demo 只包含内容区域。

card/simple

:::

## 带页签的卡片

:::demo 可承载更多内容

card/tabs

:::

## API

### Card

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  activeTabKey  |  当前激活页签的 key  |  string  |  -  |    |
|  bodyStyle  |  内容区域自定义样式  |  object  |  -  |    |
|  bordered  |  是否有边框  |  boolean  |  true  |    |
|  defaultActiveTabKey  |  初始化选中页签的 key，如果没有设置 activeTabKey  |  string  |  第一个页签  |    |
|  extra  |  卡片右上角的操作区域  |  string\ | slot  |  -  |    |
|  headStyle  |  自定义标题区域样式  |  object  |  -  |    |
|  hoverable  |  鼠标移过时可浮起  |  boolean  |  false  |    |
|  loading  |  当卡片内容还在加载中时，可以用 loading 展示一个占位  |  boolean  |  false  |    |
|  size  |  card 的尺寸  |  `default` \ |  `small`  |  `default`  |    |
|  tabList  |  页签标题列表, 可以通过 customTab(v3.0) 插槽自定义 tab  |  Array&lt;\{key: string, tab: any\}>  |  -  |    |
|  title  |  卡片标题  |  string\ | slot  |  -  |    |
|  type  |  卡片类型，可设置为 `inner` 或 不设置  |  string  |  -  |    |

### Card 插槽

|  插槽名称            |  说明                        |  参数                       |       |
| ------------------ | -------------------------- | ------------------------- | --- |
|  actions             |  卡片操作组，位置在卡片底部  |  -                          |       |
|  cover               |  卡片封面                    |  -                          |       |
|  customTab           |  自定义 tabList tab 标签     |  \{ item: tabList[number] \}  |       |
|  extra               |  卡片右上角的操作区域        |  -                          |       |
|  tabBarExtraContent  |  tab bar 上额外的元素        |  -                          |       |
|  title               |  卡片标题                    |  -                          |       |

### 事件

|  事件名称   |  说明            |  回调参数       |  版本  |       |
| --------- | -------------- | ------------- | ---- | --- |
|  tabChange  |  页签切换的回调  |  (key) => void  |  -     |       |

### Card.Grid

### Card.Meta

|  参数         |  说明       |  类型          |  默认值  |  版本  |
| ----------- | --------- | ------------ | ------ | ---- |
|  avatar       |  头像/图标  |  slot          |  -       |        |
|  description  |  描述内容   |  string\ | slot  |  -       |        |
|  title        |  标题内容   |  string\ | slot  |  -       |        |
