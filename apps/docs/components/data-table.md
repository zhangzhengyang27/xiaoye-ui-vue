# DataTable 数据表格

用于展示大量结构化数据，支持排序、筛选、分页、选择、行展开、行编辑等功能。

## 何时使用

- 需要展示行、列结构的数据时。
- 需要对数据进行排序、筛选、分页、选择、行展开、行编辑等操作时。

## 基础用法

:::demo 通过 `value` 绑定数据，`columns` 定义列，即可渲染基础表格。可配合 `show-gridlines` 显示网格线、`striped-rows` 启用斑马纹。

data-table/basic

:::

## 行选择

:::demo 设置 `selection-mode`（`single` 或 `multiple`）并绑定 `v-model:selection`，即可实现单选或多选。建议同时设置 `data-key` 以提升大数据量下的选择性能。

data-table/selection

:::

## 排序

:::demo 在 `columns` 中将列的 `sortable` 设为 `true` 即可启用排序。设置 `sort-mode` 为 `single`（默认）或 `multiple`，`removable-sort` 支持第三次点击取消排序。

data-table/sort

:::

## 分页

:::demo 设置 `pagination`、`rows`、`total-records`，并通过 `v-model:first` 控制当前页起始索引。也可绑定 `v-model:rows` 控制每页条数。

data-table/pagination

:::

## API

### DataTable 属性

#### 数据与列

| 属性        | 说明                                             | 类型                 | 默认值 |
| ----------- | ------------------------------------------------ | -------------------- | ------ |
| value       | 表格数据源                                       | `any[]`              | -      |
| columns     | 列配置数组，支持字段别名 `dataIndex`、`title` 等 | `any[]`              | -      |
| dataKey     | 每行唯一标识字段，用于选择、展开、编辑等状态追踪 | `string \| Function` | -      |
| frozenValue | 冻结行数据，始终显示在表格顶部                   | `any[]`              | -      |

#### 分页

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| pagination | 是否启用分页 | boolean | `false` |
| paginationPosition | 分页器位置 | `'top' \| 'bottom' \| 'both'` | `'bottom'` |
| alwaysShowPagination | 只有一页时是否仍显示分页器 | boolean | `true` |
| rows | 每页显示条数 | number | `0` |
| first | 当前页起始索引 | number | `0` |
| totalRecords | 总记录数，`lazy` 模式下必填 | number | `0` |
| rowsPerPageOptions | 每页条数可选值 | `any[]` | - |
| pageLinkSize | 分页链接最大显示数量 | number | `5` |
| currentPageReportTemplate | 当前页报告模板 | string | `'({currentPage} of {totalPages})'` |
| paginationTemplate | 分页器布局模板 | `string \| object` | `'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'` |

#### 排序

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| sortable | 是否启用排序（列级需再设置 `sortable`） | boolean | `false` |
| sortMode | 排序模式 | `'single' \| 'multiple'` | `'single'` |
| sortField | 当前排序字段 | `string \| Function` | - |
| sortOrder | 当前排序方向，`1` 升序，`-1` 降序 | `number` | - |
| defaultSortOrder | 默认排序方向 | number | `1` |
| nullSortOrder | null 值排序方向 | number | `1` |
| multiSortMeta | 多列排序元数据 | `DataTableSortMeta[]` | - |
| removableSort | 再次点击排序时是否取消排序 | boolean | `false` |

#### 筛选

| 属性               | 说明                                     | 类型                  | 默认值  |
| ------------------ | ---------------------------------------- | --------------------- | ------- |
| filters            | 当前筛选条件                             | `DataTableFilterMeta` | -       |
| filterDisplay      | 筛选显示方式                             | `'menu' \| 'row'`     | -       |
| globalFilterFields | 全局筛选字段列表                         | `string[]`            | -       |
| filterLocale       | 筛选本地化标识                           | `string`              | -       |
| lazy               | 是否为懒加载模式（服务端排序/筛选/分页） | boolean               | `false` |

#### 选择

| 属性                 | 说明                        | 类型                       | 默认值         |
| -------------------- | --------------------------- | -------------------------- | -------------- |
| selection            | 当前选中项                  | `any \| any[]`             | -              |
| selectionMode        | 选择模式                    | `'single' \| 'multiple'`   | -              |
| compareSelectionBy   | 选择比较方式                | `'equals' \| 'deepEquals'` | `'deepEquals'` |
| metaKeySelection     | 多选时是否需要按住 Ctrl/Cmd | boolean                    | `false`        |
| selectAll            | 是否全选（受控场景）        | `boolean \| null`          | `null`         |
| selectionDisabled    | 判断某行是否禁止选择的函数  | `(data: any) => boolean`   | -              |
| contextMenu          | 是否启用右键菜单选择        | boolean                    | `false`        |
| contextMenuSelection | 右键菜单选中的行            | `any`                      | `null`         |
| highlightOnSelect    | 选中时是否高亮行            | boolean                    | `false`        |
| rowHover             | 鼠标悬停时是否高亮行        | boolean                    | `false`        |

#### 行展开与分组

| 属性                | 说明                     | 类型                             | 默认值  |
| ------------------- | ------------------------ | -------------------------------- | ------- |
| expandedRows        | 当前展开的行             | `any[] \| DataTableExpandedRows` | -       |
| expandedRowIcon     | 行展开图标类名           | `string`                         | -       |
| collapsedRowIcon    | 行折叠图标类名           | `string`                         | -       |
| rowExpandable       | 判断某行是否可展开的函数 | `(data: any) => boolean`         | -       |
| rowGroupMode        | 行分组模式               | `'subheader' \| 'rowspan'`       | -       |
| groupRowsBy         | 分组字段                 | `string \| string[] \| Function` | -       |
| expandableRowGroups | 分组是否可展开           | boolean                          | `false` |
| expandedRowGroups   | 当前展开的分组           | `any[]`                          | -       |

#### 编辑

| 属性            | 说明               | 类型                              | 默认值       |
| --------------- | ------------------ | --------------------------------- | ------------ |
| editMode        | 编辑模式           | `'cell' \| 'row'`                 | -            |
| editingRows     | 当前正在编辑的行   | `any[]`                           | -            |
| editButtonProps | 行编辑按钮的 Props | `DataTableEditButtonPropsOptions` | 见源码默认值 |

#### 列宽与列拖拽

| 属性               | 说明               | 类型                | 默认值  |
| ------------------ | ------------------ | ------------------- | ------- |
| resizableColumns   | 是否允许调整列宽   | boolean             | `false` |
| columnResizeMode   | 列宽调整模式       | `'fit' \| 'expand'` | `'fit'` |
| reorderableColumns | 是否允许拖拽列排序 | boolean             | `false` |

#### 状态持久化

| 属性         | 说明         | 类型                   | 默认值      |
| ------------ | ------------ | ---------------------- | ----------- |
| stateStorage | 状态存储方式 | `'session' \| 'local'` | `'session'` |
| stateKey     | 状态存储键名 | `string`               | -           |

#### 滚动与虚拟滚动

| 属性                   | 说明                  | 类型                   | 默认值  |
| ---------------------- | --------------------- | ---------------------- | ------- |
| scrollable             | 是否启用横向/纵向滚动 | boolean                | `false` |
| scrollHeight           | 表格滚动区域高度      | `string`               | -       |
| virtualScrollerOptions | 虚拟滚动配置          | `VirtualScrollerProps` | -       |

#### 样式与加载

| 属性          | 说明                        | 类型                              | 默认值    |
| ------------- | --------------------------- | --------------------------------- | --------- |
| size          | 表格尺寸                    | `'small' \| 'large'`              | -         |
| showHeaders   | 是否显示表头                | boolean                           | `true`    |
| showGridlines | 是否显示网格线              | boolean                           | `false`   |
| stripedRows   | 是否启用斑马纹              | boolean                           | `false`   |
| loading       | 是否显示加载状态            | boolean                           | `false`   |
| loadingIcon   | 加载图标类名                | `string`                          | -         |
| tableStyle    | 表格根节点样式              | `CSSProperties`                   | -         |
| tableClass    | 表格根节点类名              | `string \| object`                | -         |
| tableProps    | 透传给 `<table>` 的原生属性 | `Record<string, any>`             | -         |
| rowClass      | 行类名计算函数              | `(data: any) => string \| object` | -         |
| rowStyle      | 行样式计算函数              | `(data: any) => object`           | -         |
| breakpoint    | 响应式断点                  | `string`                          | `'960px'` |

#### 导出

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| csvSeparator | CSV 分隔符 | `string` | `','` |
| exportFilename | 导出文件名 | `string` | `'download'` |
| exportFunction | 自定义单元格导出格式化函数 | `(options: { data: any; field: string }) => string` | - |

#### 筛选按钮与输入框

| 属性              | 说明                 | 类型                                | 默认值       |
| ----------------- | -------------------- | ----------------------------------- | ------------ |
| filterInputProps  | 筛选输入框透传 Props | `object`                            | -            |
| filterButtonProps | 筛选按钮 Props       | `DataTableFilterButtonPropsOptions` | 见源码默认值 |

### DataTable 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| value-change | 数据经过排序、筛选、分页处理后的值变化时触发 | `(value: any[]) => void` |
| update:first | 分页起始索引变化时触发（`v-model:first`） | `(first: number) => void` |
| update:rows | 每页条数变化时触发（`v-model:rows`） | `(rows: number) => void` |
| page | 页码变化时触发 | `(event: DataTablePageEvent) => void` |
| update:sortField | 排序字段变化时触发 | `(sortField: any) => void` |
| update:sortOrder | 排序方向变化时触发 | `(sortOrder: number \| null) => void` |
| update:multiSortMeta | 多列排序元数据变化时触发 | `(multiSortMeta: DataTableSortMeta[]) => void` |
| sort | 排序时触发 | `(event: DataTableSortEvent) => void` |
| filter | 筛选时触发 | `(event: DataTableFilterEvent) => void` |
| update:filters | 筛选条件变化时触发 | `(filters: DataTableFilterMeta) => void` |
| row-click | 单击行时触发 | `(event: DataTableRowEvent) => void` |
| row-dblclick | 双击行时触发 | `(event: DataTableRowEvent) => void` |
| row-contextmenu | 右键点击行时触发 | `(event: DataTableRowEvent) => void` |
| update:selection | 选中项变化时触发 | `(selection: any \| any[]) => void` |
| row-select | 选中某行时触发 | `(event: DataTableRowSelectEvent) => void` |
| row-unselect | 取消选中某行时触发 | `(event: DataTableRowSelectEvent) => void` |
| row-select-all | 全选时触发 | `(event: { originalEvent: Event; data: any[] }) => void` |
| row-unselect-all | 取消全选时触发 | `(event: { originalEvent: Event }) => void` |
| select-all-change | 全选状态变化时触发（受控 `selectAll`） | `(event: any) => void` |
| update:contextMenuSelection | 右键菜单选中项变化时触发 | `(selection: any) => void` |
| column-resize-end | 列宽调整结束时触发 | `(event: { element: HTMLElement; delta: number }) => void` |
| column-reorder | 列拖拽排序后触发 | `(event: { originalEvent: DragEvent; dragIndex: number; dropIndex: number }) => void` |
| row-reorder | 行拖拽排序后触发 | `(event: { originalEvent: DragEvent; dragIndex: number; dropIndex: number; value: any[] }) => void` |
| update:expandedRows | 展开行变化时触发 | `(expandedRows: any[] \| DataTableExpandedRows) => void` |
| row-expand | 展开某行时触发 | `(event: DataTableRowExpandEvent) => void` |
| row-collapse | 折叠某行时触发 | `(event: DataTableRowExpandEvent) => void` |
| update:expandedRowGroups | 展开分组变化时触发 | `(expandedRowGroups: any[]) => void` |
| rowgroup-expand | 展开分组时触发 | `(event: { originalEvent: Event; data: any }) => void` |
| rowgroup-collapse | 折叠分组时触发 | `(event: { originalEvent: Event; data: any }) => void` |
| state-save | 状态保存到 Storage 时触发 | `(state: any) => void` |
| state-restore | 状态从 Storage 恢复时触发 | `(state: any) => void` |
| cell-edit-init | 单元格进入编辑状态时触发 | `(event: DataTableCellEditEvent) => void` |
| cell-edit-complete | 单元格编辑完成时触发 | `(event: DataTableCellEditEvent) => void` |
| cell-edit-cancel | 单元格编辑取消时触发 | `(event: DataTableCellEditEvent) => void` |
| update:editingRows | 编辑行变化时触发 | `(editingRows: any[]) => void` |
| row-edit-init | 行进入编辑状态时触发 | `(event: DataTableRowEditEvent) => void` |
| row-edit-save | 行编辑保存时触发 | `(event: DataTableRowEditEvent) => void` |
| row-edit-cancel | 行编辑取消时触发 | `(event: DataTableRowEditEvent) => void` |
| update:totalRecords | 总记录数变化时触发 | `(totalRecords: number) => void` |

### DataTable 插槽

#### 表格级插槽

| 插槽名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 自定义列布局，通常使用 `XYColumn` 组件 | - |
| header | 表格顶部自定义内容 | - |
| footer | 表格底部自定义内容 | - |
| empty | 无数据时显示的内容 | - |
| loading | 自定义加载遮罩内容 | - |
| loadingicon | 自定义加载图标 | - |
| expansion | 行展开内容 | `{ data: any; index: number }` |
| groupheader | 分组头部内容 | `{ data: any; index: number }` |
| groupfooter | 分组底部内容 | `{ data: any; index: number }` |
| rowtoggleicon / rowgrouptogglericon | 行展开/分组展开切换图标 | `{ rowExpanded: boolean }` / `{ expanded: boolean }` |
| rowreorderindicatorupicon / reorderindicatorupicon | 列/行拖拽排序向上指示器图标 | - |
| rowreorderindicatordownicon / reorderindicatordownicon | 列/行拖拽排序向下指示器图标 | - |

#### 分页器插槽

| 插槽名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| paginationcontainer | 分页器容器 | `{ first, last, rows, page, pageCount, pageLinks, totalRecords, firstPageCallback, lastPageCallback, prevPageCallback, nextPageCallback, rowChangeCallback, changePageCallback }` |
| paginationstart | 分页器起始位置内容 | - |
| paginationend | 分页器结束位置内容 | - |
| paginationfirstpagelinkicon | 第一页图标 | `{ class: string }` |
| paginationprevpagelinkicon | 上一页图标 | `{ class: string }` |
| paginationnextpagelinkicon | 下一页图标 | `{ class: string }` |
| paginationlastpagelinkicon | 最后一页图标 | `{ class: string }` |
| paginationjumptopagedropdownicon | 跳转页下拉图标 | `{ class: string }` |
| paginationrowsperpagedropdownicon | 每页条数下拉图标 | `{ class: string }` |

### XYColumn 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columnKey | 列唯一标识 | `string` | - |
| field | 字段名 | `string \| Function` | - |
| sortField | 排序字段名 | `string \| Function` | - |
| filterField | 筛选字段名 | `string \| Function` | - |
| dataType | 数据类型，用于筛选匹配模式 | `string` | - |
| sortable | 是否可排序 | boolean | `false` |
| header | 表头文本 | `string` | - |
| footer | 表尾文本 | `string` | - |
| style | 列样式 | `any` | - |
| class | 列类名 | `any` | - |
| headerStyle | 表头单元格样式 | `any` | - |
| headerClass | 表头单元格类名 | `any` | - |
| bodyStyle | 内容单元格样式 | `any` | - |
| bodyClass | 内容单元格类名 | `any` | - |
| footerStyle | 表尾单元格样式 | `any` | - |
| footerClass | 表尾单元格类名 | `any` | - |
| filterHeaderStyle | 行筛选表头样式 | `any` | - |
| filterHeaderClass | 行筛选表头类名 | `any` | - |
| filterMenuStyle | 筛选菜单样式 | `any` | - |
| filterMenuClass | 筛选菜单类名 | `any` | - |
| showFilterMenu | 是否显示筛选菜单按钮 | boolean | `true` |
| showFilterOperator | 是否显示筛选操作符 | boolean | `true` |
| showClearButton | 是否显示清空按钮 | boolean | `false` |
| showApplyButton | 是否显示应用按钮 | boolean | `true` |
| showFilterMatchModes | 是否显示匹配模式选项 | boolean | `true` |
| showAddButton | 是否显示添加规则按钮 | boolean | `true` |
| filterMatchMode | 默认筛选匹配模式 | `string` | - |
| filterMatchModeOptions | 筛选匹配模式选项 | `any[]` | - |
| maxConstraints | 最大筛选条件数 | number | `2` |
| excludeGlobalFilter | 是否排除在全局筛选之外 | boolean | `false` |
| selectionMode | 选择模式，通常为 `'multiple'` 用于多选列 | `string` | - |
| hideSelectAll | 是否隐藏全选复选框 | boolean | `false` |
| expander | 是否为展开列 | boolean | `false` |
| rowReorder | 是否允许拖拽排序行 | boolean | `false` |
| rowReorderIcon | 行拖拽图标类名 | `string` | - |
| rowEditor | 是否为行编辑操作列 | boolean | `false` |
| frozen | 是否冻结列 | boolean | `false` |
| alignFrozen | 冻结对齐方向 | `'left' \| 'right'` | `'left'` |
| exportable | 是否参与 CSV 导出 | boolean | `true` |
| exportHeader | 导出表头文本 | `string` | - |
| exportFooter | 导出表尾文本 | `string` | - |
| colspan | 表头合并列数 | `number` | - |
| rowspan | 表头合并行数 | `number` | - |
| hidden | 是否隐藏列 | boolean | `false` |
| reorderableColumn | 是否允许拖拽该列排序 | boolean | `false` |
| getCellProps | 自定义单元格 Props | `(data: any, rowIndex: number) => object` | - |

### XYColumn 插槽

| 插槽名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 表头内容，优先级高于 `header` 属性 | `{ column }` |
| header | 表头内容 | `{ column }` |
| body | 单元格内容 | `{ data: any; column: any; field: string; index: number; frozenRow: boolean; editorInitCallback: Function; rowTogglerCallback: Function }` |
| editor | 单元格编辑态内容 | `{ data: any; column: any; field: string; index: number; frozenRow: boolean; editorSaveCallback: Function; editorCancelCallback: Function }` |
| footer | 表尾内容 | `{ column }` |
| filter | 自定义筛选组件 | 见 `ColumnFilter` |
| filterheader | 筛选菜单头部 | - |
| filterfooter | 筛选菜单底部 | - |
| filterclear | 筛选清空按钮 | - |
| filterapply | 筛选应用按钮 | - |
| filtericon | 筛选图标 | - |
| filteraddicon | 筛选添加规则图标 | - |
| filterremoveicon | 筛选移除规则图标 | - |
| filterclearicon | 筛选清空图标 | - |
| loading | 虚拟滚动加载单元格内容 | `{ data, column, field, index, frozenRow, loadingOptions }` |
| sorticon | 自定义排序图标 | `{ sorted: boolean; sortOrder: number \| null }` |
| headercheckboxicon | 表头全选复选框图标 | - |
| rowcheckboxicon | 行选择复选框图标 | - |
| rowreordericon | 行拖拽图标 | - |
| rowtoggleicon / rowtogglericon | 行展开图标 | `{ rowExpanded: boolean }` |
| roweditoriniticon | 行编辑初始化图标 | - |
| roweditorsaveicon | 行编辑保存图标 | - |
| roweditorcancelicon | 行编辑取消图标 | - |

### XYColumnGroup 属性

| 属性 | 说明                         | 类型                   | 默认值 |
| ---- | ---------------------------- | ---------------------- | ------ |
| type | 分组类型，用于表头或表尾分组 | `'header' \| 'footer'` | -      |

### DataTable 方法

通过 `ref` 获取组件实例后，可调用以下方法：

| 方法名                  | 说明                                                            |
| ----------------------- | --------------------------------------------------------------- |
| exportCSV(options?)     | 导出当前数据为 CSV 文件，`options.selectionOnly` 可仅导出选中项 |
| resetPage()             | 重置到第一页                                                    |
| getVirtualScrollerRef() | 获取虚拟滚动组件引用                                            |

## 类型定义

组件库从 `xiaoye-ui/data-table` 导出了以下常用类型：

| 类型名称                                 | 说明                                        |
| ---------------------------------------- | ------------------------------------------- |
| DataTableProps                           | DataTable 组件 Props 类型                   |
| DataTableType                            | DataTable 类型                              |
| DataTableSelectionMode                   | 选择模式：`'single' \| 'multiple'`          |
| DataTableSortMode                        | 排序模式：`'single' \| 'multiple'`          |
| DataTableSortMeta                        | 排序元数据 `{ field, order }`               |
| DataTableFilterMeta                      | 筛选元数据                                  |
| DataTableFilterMetaData                  | 单个筛选条件 `{ value, matchMode }`         |
| DataTableOperatorFilterMetaData          | 操作符筛选条件 `{ operator, constraints }`  |
| DataTableRowGroupMode                    | 行分组模式：`'subheader' \| 'rowspan'`      |
| DataTableEditMode                        | 编辑模式：`'cell' \| 'row'`                 |
| DataTableSize                            | 表格尺寸：`'small' \| 'large'`              |
| DataTableStateStorage                    | 状态存储：`'session' \| 'local'`            |
| DataTableColumnResizeMode                | 列宽调整模式：`'fit' \| 'expand'`           |
| DataTablePaginationPosition              | 分页器位置：`'top' \| 'bottom' \| 'both'`   |
| DataTableFilterDisplay                   | 筛选显示方式：`'menu' \| 'row'`             |
| DataTableExpandedRows                    | 展开行对象类型 `{ [key: string]: boolean }` |
| DataTableEditingRows                     | 编辑行对象类型 `{ [key: string]: boolean }` |
| DataTableExportCSVOptions                | CSV 导出选项 `{ selectionOnly: boolean }`   |
| DataTableExportFunctionOptions           | 导出函数选项 `{ data, field }`              |
| DataTableFilterButtonPropsOptions        | 筛选按钮 Props                              |
| DataTableFilterButtonInlinePropsOptions  | 行内筛选按钮 Props                          |
| DataTableFilterButtonPopoverPropsOptions | 弹窗筛选按钮 Props                          |
| DataTableEditButtonPropsOptions          | 行编辑按钮 Props                            |
| DataTableVirtualScrollerProps            | 虚拟滚动 Props                              |

## 最佳实践

### 结合分页与选择

当表格同时启用分页和选择时，建议：

1. 设置 `data-key`，避免跨页选择时因对象引用变化导致状态丢失。
2. 多选场景下，表头全选默认只选中当前页；如需跨页全选，可监听 `select-all-change` 事件手动维护 `selection`。
3. 分页切换时若使用服务端数据，建议开启 `lazy` 模式，并通过 `page` 事件请求对应页数据。

### 受控状态

DataTable 的多个状态支持 `v-model` 双向绑定：

- `v-model:first`：分页起始索引
- `v-model:rows`：每页条数
- `v-model:selection`：选中项
- `v-model:sortField` / `v-model:sortOrder` / `v-model:multiSortMeta`：排序状态
- `v-model:filters`：筛选条件
- `v-model:expandedRows`：展开行
- `v-model:expandedRowGroups`：展开分组
- `v-model:editingRows`：编辑行

在受控模式下，父组件负责更新这些值，组件内部仅根据 Props 渲染。

### 服务端懒加载

设置 `lazy` 后，排序、筛选、分页不会在前端自动处理数据，而是通过 `sort`、`filter`、`page` 事件把当前状态（`first`、`rows`、`sortField`、`sortOrder`、`multiSortMeta`、`filters`）抛出，由父组件请求服务端数据并更新 `value`。

### 性能建议

- 大数据量时建议开启 `scrollable` 与 `virtualScrollerOptions` 启用虚拟滚动。
- 务必设置 `data-key`，可显著优化选择、展开、编辑等状态的 diff 性能。
- 尽量避免在 `columns` 配置中使用复杂函数或内联对象，防止不必要的重渲染。
