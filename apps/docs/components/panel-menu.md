# PanelMenu 面板菜单

PanelMenu 是手风琴（Accordion）与树形（Tree）组件的混合体。每个顶层菜单项渲染为一个可折叠的面板，面板内部以树形结构展示多级子菜单，适合用于后台系统的侧边导航。

## 何时使用

- 需要在侧边栏中以折叠面板形式组织多级导航时。
- 既要面板的折叠交互，又要树形的多级展开能力时。
- 后台管理系统、文档站点的左侧导航菜单。

## 基础用法

:::demo 通过 `model` 传入菜单项数组，每个顶层项渲染为一个可折叠面板，点击面板头部即可展开 / 折叠。

panel-menu/basic

:::

## 带图标

:::demo 菜单项支持 `icon` 字段，传入图标类名或节点；展开 / 折叠状态分别使用 `DownOutlined` 与 `RightOutlined` 图标。

panel-menu/with-icons

:::

## 多个展开

:::demo 默认情况下同一时刻只会展开一个面板，设置 `multiple` 为 true 后可同时展开多个面板。

panel-menu/multiple-expand

:::

## 多级嵌套

:::demo 子菜单项可以通过 `items` 字段继续嵌套子菜单，形成多级树形结构，支持任意层级。

panel-menu/nested

:::

## 受控模式

:::demo 通过 `v-model:expandedKeys` 绑定一个对象，对象的 key 为菜单项 `key`，value 为是否展开。此模式下展开状态完全由外部控制。

panel-menu/controlled

:::

## API

### PanelMenu Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 菜单项数组 | `PanelMenuItem[]` | `[]` |
| expandedKeys | 展开的子菜单 key 映射（受控） | `Record<string, boolean>` | - |
| activeItem | 当前选中项 key | `string` | - |
| multiple | 是否允许同时展开多个面板 | `boolean` | `false` |
| tabindex | tab 键聚焦顺序 | `number \| string` | `0` |
| prefixCls | 自定义类名前缀 | `string` | `xy-panel-menu` |
| onExpand | 面板展开时触发 | `(e: { originalEvent, item }) => void` | - |
| onCollapse | 面板折叠时触发 | `(e: { originalEvent, item }) => void` | - |
| onItemClick | 点击子菜单项时触发 | `(e: { originalEvent, item }) => void` | - |

### PanelMenuItem 数据结构

| 属性        | 说明           | 类型              | 默认值  |
| ----------- | -------------- | ----------------- | ------- |
| key         | 唯一标识       | `string`          | -       |
| label       | 菜单项文本     | `string`          | -       |
| icon        | 图标类名或节点 | `any`             | -       |
| items       | 子菜单项数组   | `PanelMenuItem[]` | -       |
| disabled    | 是否禁用       | `boolean`         | `false` |
| visible     | 是否可见       | `boolean`         | `true`  |
| url         | 链接地址       | `string`          | -       |
| target      | 链接 target    | `string`          | -       |
| separator   | 是否作为分隔符 | `boolean`         | `false` |
| command     | 点击命令回调   | `(e) => void`     | -       |
| style       | 自定义样式     | `object`          | -       |
| class       | 自定义类名     | `any`             | -       |
| headerClass | 头部自定义类名 | `any`             | -       |

### PanelMenu Events

| 事件名              | 说明                   | 回调参数                          |
| ------------------- | ---------------------- | --------------------------------- |
| update:expandedKeys | 展开状态变化时触发     | `(keys: Record<string, boolean>)` |
| update:activeItem   | 选中项变化时触发       | `(key: string)`                   |
| expand              | 面板展开时触发         | `({ originalEvent, item })`       |
| collapse            | 面板折叠时触发         | `({ originalEvent, item })`       |
| itemClick           | 点击子菜单项时触发     | `({ originalEvent, item })`       |
| panel-open          | 面板展开时触发（兼容） | `({ originalEvent, item })`       |
| panel-close         | 面板折叠时触发（兼容） | `({ originalEvent, item })`       |

### PanelMenu Slots

| 插槽名      | 说明                      | 参数                                               |
| ----------- | ------------------------- | -------------------------------------------------- |
| item        | 自定义菜单项内容          | `{ item, root, active, hasSubmenu, label, props }` |
| submenuicon | 自定义子菜单展开/折叠图标 | `{ active }`                                       |
| headericon  | 自定义头部图标            | `{ item, class }`                                  |
| itemicon    | 自定义子项图标            | `{ item, class }`                                  |

### 受控与非受控说明

- 未传入 `expandedKeys` 时为非受控模式，组件内部维护展开状态。
- 通过 `v-model:expandedKeys` 绑定后为受控模式，需由外部控制状态。
- `multiple` 为 `false` 时，非受控模式下同一时刻仅一个面板展开。
