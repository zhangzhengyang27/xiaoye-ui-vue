# DataTable 数据表格

用于展示大量结构化数据，支持排序、筛选、分页、选择、行展开等功能。

## 何时使用

- 需要展示行、列结构的数据时。
- 需要对数据进行排序、筛选、分页、选择等操作时。

## 基础用法

:::demo 通过 `value` 绑定数据，`columns` 定义列，即可渲染基础表格。

data-table/basic

:::

## 行选择

:::demo 设置 `selection-mode` 并绑定 `v-model:selection` 实现行选择。

data-table/selection

:::

## 排序

:::demo 设置 `sortable` 列属性启用排序功能。

data-table/sort

:::

## 分页

:::demo 设置 `pagination` 与 `rows` 启用分页功能。

data-table/pagination

:::
