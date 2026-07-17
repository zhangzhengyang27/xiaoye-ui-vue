# OrganizationChart 组织架构图

以层级结构可视化组织架构、分类信息等树形数据。

## 何时使用

- 需要展示企业组织架构、部门层级关系。
- 需要展示分类目录、文件系统等树形结构数据。
- 需要对树形节点进行选择、折叠展开操作时。

## 基础用法

:::demo 通过 `value` 传入一个树形根节点数据，每个节点包含 `key`、`data`、`children` 等字段。使用默认插槽自定义节点内容，插槽参数为 `{ node }`。

organization-chart/basic

:::

## 节点选择

:::demo 设置 `selection-mode` 为 `single` 或 `multiple` 开启节点选择能力，通过 `selection-keys`（受控）或 `update:selectionKeys` 事件管理选中状态。

organization-chart/selection

:::

## 可折叠节点

:::demo 设置 `collapsible` 开启折叠能力，通过 `collapsed-keys` 控制折叠状态，监听 `node-expand` / `node-collapse` 事件。

organization-chart/collapsible

:::

## 自定义节点模板

:::demo 节点的 `type` 字段可用于匹配具名插槽，从而为不同类型的节点渲染不同的内容。例如 `type="department"` 匹配 `#department` 插槽。

organization-chart/custom-template

:::

## 带头像的节点

:::demo 在节点模板中嵌入头像、图标等富信息内容，使组织架构图更直观。

organization-chart/with-images

:::

## API

### OrganizationChart Props

| 属性           | 说明                | 类型                           | 默认值 |
| -------------- | ------------------- | ------------------------------ | ------ |
| value          | 树形数据的根节点    | OrganizationChartNode \| null  | null   |
| selection-mode | 选择模式            | `single` \| `multiple` \| null | null   |
| selection-keys | 受控的选中节点 keys | object \| null                 | null   |
| collapsible    | 是否允许折叠节点    | boolean                        | false  |
| collapsed-keys | 受控的折叠节点 keys | object \| null                 | null   |

### OrganizationChartNode 数据结构

| 字段        | 说明                         | 类型                    |
| ----------- | ---------------------------- | ----------------------- |
| key         | 节点唯一标识                 | any                     |
| type        | 节点类型，可用于匹配具名插槽 | string                  |
| styleClass  | 节点自定义类名               | string                  |
| data        | 节点携带的业务数据           | any                     |
| selectable  | 是否允许选择，默认 true      | boolean                 |
| collapsible | 是否允许折叠，默认 true      | boolean                 |
| children    | 子节点数组                   | OrganizationChartNode[] |

### OrganizationChart Events

| 事件名               | 说明               | 回调参数                      |
| -------------------- | ------------------ | ----------------------------- |
| node-select          | 节点被选中时触发   | (node: OrganizationChartNode) |
| node-unselect        | 节点取消选中时触发 | (node: OrganizationChartNode) |
| node-expand          | 节点展开时触发     | (node: OrganizationChartNode) |
| node-collapse        | 节点折叠时触发     | (node: OrganizationChartNode) |
| update:selectionKeys | 选中状态变化时触发 | (keys: object)                |
| update:collapsedKeys | 折叠状态变化时触发 | (keys: object)                |

### OrganizationChart Slots

| 插槽名      | 说明                                                 | 参数         |
| ----------- | ---------------------------------------------------- | ------------ |
| default     | 默认节点内容模板                                     | { node }     |
| [node.type] | 与节点 `type` 字段同名的具名插槽，优先级高于 default | { node }     |
| toggleicon  | 折叠/展开图标自定义模板                              | { expanded } |
