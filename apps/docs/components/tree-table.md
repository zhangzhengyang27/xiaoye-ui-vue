# TreeTable 树形表格

以表格形式展示具有树形层级结构的数据，支持展开收起、选择、排序、筛选与分页。

## 何时使用

- 需要在表格中展示父子层级数据，如组织架构、文件夹目录、分类树等。
- 需要对树形数据进行排序、筛选、分页等表格常规操作。
- 需要单选、多选或复选框模式选择树节点。

## 基础用法

:::demo 通过 `value` 传入树形数据，每个节点包含 `key`、`data` 与 `children`。使用 `Column` 子组件声明列，设置 `field` 与 `header`。将 `expander` 设置在某一列上以渲染展开收起按钮。

tree-table/basic

:::

## 选择节点

:::demo 通过 `selection-mode` 设置选择模式：`single` 单选、`multiple` 多选、`checkbox` 复选框。配合 `selection-keys` 双向绑定选中节点的 key 集合。

tree-table/selection

:::

## 分页

:::demo 设置 `pagination` 开启分页，`rows` 控制每页条数，`rows-per-page-options` 配置每页条数可选项。翻页时会自动收起所有节点。

tree-table/with-pagination

:::

## 排序

:::demo 在 `Column` 上设置 `sortable` 开启排序，点击列头切换升序/降序。通过 `sort-field` 与 `sort-order` 双向绑定当前排序状态，`sort-order` 为 `1` 升序、`-1` 降序。

tree-table/with-sorting

:::

## 筛选

:::demo 通过 `filters` 配置筛选条件，键为字段名，值为 `{ value, matchMode }`。在 `Column` 上声明 `filter-field` 与 `filter-match-mode`。使用 `filter` 插槽自定义列头筛选输入。

tree-table/with-filters

:::

## 受控展开收起

:::demo 通过 `expanded-keys` 双向绑定展开节点的 key 集合，配合 `node-expand` 与 `node-collapse` 事件监听节点展开/收起。可外部按钮一键展开或收起全部节点。

tree-table/expand-collapse

:::

## API

### TreeTable Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 树形数据数组 | any[] | null |
| data-key | 节点主键字段名或取值函数 | string \| ((node) => any) | `key` |
| expanded-keys | 展开节点的 key 集合 | object | null |
| selection-keys | 选中节点的 key 集合 | object | null |
| selection-mode | 选择模式 | `single` \| `multiple` \| `checkbox` | - |
| meta-key-selection | 是否需配合 Ctrl/Meta 键多选 | boolean | false |
| context-menu | 是否启用右键菜单 | boolean | false |
| context-menu-selection | 右键选中节点 | any | null |
| rows | 每页条数 | number | 0 |
| first | 起始记录下标 | number | 0 |
| total-records | 总记录数（lazy 模式下使用） | number | 0 |
| pagination | 是否开启分页 | boolean | false |
| pagination-position | 分页器位置 | `top` \| `bottom` \| `both` | `bottom` |
| always-show-pagination | 单页时是否仍显示分页 | boolean | true |
| rows-per-page-options | 每页条数可选项 | number[] | [] |
| lazy | 是否懒加载 | boolean | false |
| loading | 是否加载中 | boolean | false |
| loading-icon | 加载图标类名 | string | - |
| loading-mode | 加载展示模式 | `mask` \| `icon` | `mask` |
| row-hover | 是否行悬停高亮 | boolean | false |
| sort-field | 排序字段 | string \| ((node) => any) | null |
| sort-order | 排序方向，1 升序 / -1 降序 | number | null |
| default-sort-order | 默认排序方向 | number | 1 |
| multi-sort-meta | 多列排序配置 | TreeTableSortMeta[] | [] |
| sort-mode | 排序模式 | `single` \| `multiple` | `single` |
| removable-sort | 是否允许取消排序 | boolean | false |
| filters | 筛选条件 | TreeTableFilterMeta | null |
| filter-mode | 筛选模式 | `lenient` \| `strict` | `lenient` |
| filter-locale | 筛选语言 | string | - |
| resizable-columns | 是否允许列宽调整 | boolean | false |
| column-resize-mode | 列宽调整模式 | `fit` \| `expand` | `fit` |
| indentation | 子节点缩进（rem） | number | 1 |
| show-gridlines | 是否显示网格线 | boolean | false |
| scrollable | 是否可滚动 | boolean | false |
| scroll-height | 滚动容器最大高度 | string | null |
| size | 表格尺寸 | `small` \| `large` | - |
| table-style | 表格自定义样式 | object | null |
| table-class | 表格自定义类名 | string \| object | null |

### TreeTable Events

| 事件名                        | 说明               | 回调参数                              |
| ----------------------------- | ------------------ | ------------------------------------- |
| update:expanded-keys          | 展开节点变化时触发 | (expandedKeys)                        |
| update:selection-keys         | 选中节点变化时触发 | (selectionKeys)                       |
| node-expand                   | 节点展开时触发     | (node)                                |
| node-collapse                 | 节点收起时触发     | (node)                                |
| node-select                   | 节点选中时触发     | (node)                                |
| node-unselect                 | 节点取消选中时触发 | (node)                                |
| update:first                  | 起始下标变化时触发 | (first: number)                       |
| update:rows                   | 每页条数变化时触发 | (rows: number)                        |
| page                          | 翻页时触发         | (event: TreeTablePageEvent)           |
| update:sort-field             | 排序字段变化时触发 | (sortField)                           |
| update:sort-order             | 排序方向变化时触发 | (sortOrder)                           |
| update:multi-sort-meta        | 多列排序变化时触发 | (multiSortMeta)                       |
| sort                          | 排序时触发         | (event: TreeTableSortEvent)           |
| filter                        | 筛选时触发         | (event: TreeTableFilterEvent)         |
| column-resize-end             | 列宽调整结束时触发 | ({ element, delta })                  |
| update:context-menu-selection | 右键选中变化时触发 | (node)                                |
| row-contextmenu               | 行右键时触发       | (event: TreeTableRowContextMenuEvent) |

### TreeTable Slots

| 插槽名      | 说明                           | 参数      |
| ----------- | ------------------------------ | --------- |
| default     | 列定义，由 `Column` 子组件组成 | -         |
| header      | 表格顶部内容                   | -         |
| footer      | 表格底部内容                   | -         |
| empty       | 空数据内容                     | -         |
| loadingicon | 自定义加载图标                 | { class } |

### Column Props

`Column` 为 `TreeTable` 的列定义子组件，通过默认插槽传入。

| 属性                | 说明                       | 类型                      | 默认值 |
| ------------------- | -------------------------- | ------------------------- | ------ |
| field               | 数据字段名                 | string                    | -      |
| header              | 列头文本                   | string                    | -      |
| sortable            | 是否可排序                 | boolean                   | false  |
| sort-field          | 排序字段（默认取 `field`） | string                    | -      |
| expander            | 是否渲染展开收起按钮       | boolean                   | false  |
| frozen              | 是否冻结列                 | boolean                   | false  |
| align-frozen        | 冻结列对齐方向             | `left` \| `right`         | `left` |
| hidden              | 是否隐藏列                 | boolean                   | false  |
| filter-field        | 筛选字段（默认取 `field`） | string                    | -      |
| filter-match-mode   | 筛选匹配模式               | string                    | -      |
| filter-header-style | 筛选头样式                 | object                    | -      |
| filter-header-class | 筛选头类名                 | string                    | -      |
| header-style        | 列头样式                   | object                    | -      |
| header-class        | 列头类名                   | string                    | -      |
| body-style          | 单元格样式                 | object                    | -      |
| body-class          | 单元格类名                 | string                    | -      |
| footer              | 列脚文本                   | string                    | -      |
| footer-style        | 列脚样式                   | object                    | -      |
| footer-class        | 列脚类名                   | string                    | -      |
| column-key          | 列唯一标识                 | string                    | -      |
| style               | 列样式                     | object                    | -      |
| class               | 列类名                     | string \| object \| array | -      |

### Column Slots

| 插槽名         | 说明                            | 参数                  |
| -------------- | ------------------------------- | --------------------- |
| header         | 自定义列头                      | { column }            |
| body           | 自定义单元格内容                | { node, column }      |
| footer         | 自定义列脚                      | { column }            |
| filter         | 自定义列头筛选区                | { column, index }     |
| sorticon       | 自定义排序图标                  | { sorted, sortOrder } |
| rowtoggleicon  | 自定义节点展开/收起图标         | { node, expanded }    |
| rowtogglericon | 自定义节点展开/收起图标（备选） | { node, expanded }    |

## 备注

- `TreeTable` 内部通过 `HelperSet` 收集 `name: 'Column'` 的子组件作为列定义，因此 `Column` 组件必须以 `name: 'Column'` 注册。
- 节点数据结构：`{ key, data: { ... }, children: [...] }`，其中 `data` 为单元格字段来源，`children` 为子节点。
- `selection-mode` 为 `checkbox` 时，父子节点会自动联动选中状态，并支持半选状态。
