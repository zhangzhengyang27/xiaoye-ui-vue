# TreeChart 树形图

以树形结构可视化层级数据，适用于分类目录、决策树、文件系统等场景。

## 何时使用

- 需要展示分类目录、文件系统等树形结构。
- 需要展示决策树、流程分支等层级关系。
- 与组织架构图类似，但更侧重于通用树形数据的可视化。

## 基础用法

:::demo 通过 `value` 传入树形根节点，使用默认插槽自定义节点内容，插槽参数为 `{ node }`。

tree-chart/basic

:::

## 宽树横向滚动

:::demo 当树形结构层级较深、节点较多时，可将组件放入可横向滚动的容器中，避免布局被撑开。

tree-chart/horizontal

:::

## 节点选择

:::demo 设置 `selection-mode` 为 `multiple` 支持多选，通过 `v-model:selection-keys` 双向绑定选中状态。

tree-chart/selection

:::

## 自定义节点模板

:::demo 通过节点的 `type` 字段匹配具名插槽，为不同类型节点渲染差异化内容。

tree-chart/custom-template

:::

## 自定义颜色

:::demo 通过节点的 `styleClass` 字段为不同状态的节点附加自定义类名，结合 CSS 实现颜色区分。

tree-chart/with-colors

:::

## API

### TreeChart Props

| 属性           | 说明                | 类型                           | 默认值 |
| -------------- | ------------------- | ------------------------------ | ------ |
| value          | 树形数据的根节点    | TreeChartNode \| null          | null   |
| selection-mode | 选择模式            | `single` \| `multiple` \| null | null   |
| selection-keys | 受控的选中节点 keys | object \| null                 | null   |
| collapsible    | 是否允许折叠节点    | boolean                        | false  |
| collapsed-keys | 受控的折叠节点 keys | object \| null                 | null   |

### TreeChartNode 数据结构

| 字段        | 说明                         | 类型            |
| ----------- | ---------------------------- | --------------- |
| key         | 节点唯一标识                 | any             |
| type        | 节点类型，可用于匹配具名插槽 | string          |
| styleClass  | 节点自定义类名               | string          |
| data        | 节点携带的业务数据           | any             |
| selectable  | 是否允许选择，默认 true      | boolean         |
| collapsible | 是否允许折叠，默认 true      | boolean         |
| children    | 子节点数组                   | TreeChartNode[] |

### TreeChart Events

| 事件名               | 说明               | 回调参数              |
| -------------------- | ------------------ | --------------------- |
| node-select          | 节点被选中时触发   | (node: TreeChartNode) |
| node-unselect        | 节点取消选中时触发 | (node: TreeChartNode) |
| node-expand          | 节点展开时触发     | (node: TreeChartNode) |
| node-collapse        | 节点折叠时触发     | (node: TreeChartNode) |
| update:selectionKeys | 选中状态变化时触发 | (keys: object)        |
| update:collapsedKeys | 折叠状态变化时触发 | (keys: object)        |

### TreeChart Slots

| 插槽名      | 说明                                                 | 参数         |
| ----------- | ---------------------------------------------------- | ------------ |
| default     | 默认节点内容模板                                     | { node }     |
| [node.type] | 与节点 `type` 字段同名的具名插槽，优先级高于 default | { node }     |
| toggleicon  | 折叠/展开图标自定义模板                              | { expanded } |
