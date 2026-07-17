# DataView 数据视图

以列表或网格两种布局展示数据集合，并内置分页与排序能力。

## 何时使用

- 需要在列表视图与网格视图之间切换展示同一份数据。
- 商品列表、卡片集合等内容型数据的展示与分页。
- 需要对数据集合进行前端排序、分页的场景。

## 基础用法

:::demo 通过 `value` 传入数据数组，使用 `layout` 控制布局。配合 `list` 与 `grid` 两个插槽分别自定义两种布局的渲染内容，插槽参数为 `{ items }`。

data-view/basic

:::

## 网格视图

:::demo 固定 `layout` 为 `grid`，使用 `grid` 插槽渲染卡片式网格布局。

data-view/grid-view

:::

## 列表视图

:::demo 固定 `layout` 为 `list`，使用 `list` 插槽渲染行式列表布局。

data-view/list-view

:::

## 分页

:::demo 设置 `pagination` 开启分页，通过 `rows` 控制每页条数，`rows-per-page-options` 配置每页条数可选项。

data-view/with-pagination

:::

## 排序

:::demo 通过 `sort-field` 与 `sort-order` 控制排序，`sort-order` 为 `1` 升序、`-1` 降序。改变排序字段时会自动重置到第一页。

data-view/with-sorting

:::

## API

### DataView Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 数据数组 | any[] | [] |
| layout | 布局模式 | `list` \| `grid` | `list` |
| rows | 每页条数 | number | 0 |
| first | 起始记录下标 | number | 0 |
| total-records | 总记录数（lazy 模式下使用） | number | 0 |
| pagination | 是否开启分页 | boolean | false |
| pagination-position | 分页器位置 | `top` \| `bottom` \| `both` | `bottom` |
| always-show-pagination | 单页时是否仍显示分页 | boolean | true |
| page-link-size | 分页按钮数量 | number | 5 |
| rows-per-page-options | 每页条数可选项 | any[] | [] |
| current-page-report-template | 当前页描述模板 | string | `({currentPage} of {totalPages})` |
| sort-field | 排序字段 | string \| ((data) => any) | null |
| sort-order | 排序方向，1 升序 / -1 降序 | number | null |
| lazy | 是否懒加载 | boolean | false |
| data-key | 数据主键字段 | string | - |

### DataView Events

| 事件名       | 说明               | 回调参数                           |
| ------------ | ------------------ | ---------------------------------- |
| update:first | 起始下标变化时触发 | (first: number)                    |
| update:rows  | 每页条数变化时触发 | (rows: number)                     |
| page         | 翻页时触发         | ({ page, first, rows, pageCount }) |

### DataView Slots

| 插槽名 | 说明         | 参数       |
| ------ | ------------ | ---------- |
| header | 顶部内容     | -          |
| footer | 底部内容     | -          |
| list   | 列表布局内容 | { items }  |
| grid   | 网格布局内容 | { items }  |
| empty  | 空数据内容   | { layout } |
