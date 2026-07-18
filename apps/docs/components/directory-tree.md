# DirectoryTree 目录树

带文件/文件夹图标的树形控件，常用于文件目录结构展示。

## 何时使用

当需要展示文件系统、资源管理器等具有层级关系的目录结构时使用。`DirectoryTree` 是 `Tree` 的变体，默认显示文件夹与文件图标，节点占满整行，并支持 `ctrl(Windows)` / `command(Mac)` 多选与 `shift` 范围选择。

## 基础用法

:::demo 最简单的目录树，默认显示文件夹与文件图标，单击文件夹节点可展开/收起。

directory-tree/basic

:::

## 多选

:::demo 开启 `multiple` 后，按住 `ctrl(Windows)` / `command(Mac)` 可追加选中，按住 `shift` 可范围选中。

directory-tree/multiple-select

:::

## 自定义图标

:::demo 通过 `icon` 插槽自定义节点图标，覆盖默认的文件夹/文件图标。

directory-tree/custom-icon

:::

## 默认展开全部

:::demo 使用 `default-expand-all` 默认展开所有节点，配合 `default-expand-parent` 可自动展开父节点。

directory-tree/expand-all

:::

## 带搜索

:::demo 配合输入框过滤节点，并自动展开匹配项的父级节点。

directory-tree/with-search

:::

## API

### DirectoryTree Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| treeData | treeNodes 数据，如果设置了 children 属性，渲染为树状结构 | array | - |
| multiple | 支持点选多个节点（多选） | boolean | false |
| showIcon | 是否展示节点 icon | boolean | true |
| blockNode | 节点占满整行 | boolean | true |
| expandAction | 展开/收起触发动作：`false` \| `'click'` \| `'dblclick'` \| `'doubleclick'` | string \| boolean | `'click'` |
| selectedKeys | （受控）设置选中的树节点 | array | - |
| expandedKeys | （受控）展开的树节点 | array | - |
| defaultExpandAll | 默认展开所有树节点 | boolean | false |
| defaultExpandParent | 默认展开父节点 | boolean | false |
| defaultExpandedKeys | 默认展开指定的树节点 | array | - |
| defaultSelectedKeys | 默认选中的树节点 | array | - |
| fieldNames | 替换 treeNode 中 title、key、children 字段为 treeData 中对应的字段 | object | `{ title: 'title', key: 'key', children: 'children' }` |
| icon | 自定义节点图标 | function \| slot | - |

更多属性请参考 [Tree](./tree) 组件。

### DirectoryTree Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 点击树节点触发 | function(selectedKeys, e:{selected, node, selectedNodes, nativeEvent}) |
| expand | 展开/收起节点时触发 | function(expandedKeys, {expanded: bool, node, nativeEvent}) |
| click | 点击节点触发 | function(event, node) |
| dblclick | 双击节点触发 | function(event, node) |
| update:selectedKeys | 选中节点变化时触发 | function(selectedKeys) |
| update:expandedKeys | 展开节点变化时触发 | function(expandedKeys) |
