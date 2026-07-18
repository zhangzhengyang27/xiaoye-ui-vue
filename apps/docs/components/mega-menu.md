# MegaMenu 大型多列菜单

导航组件，用于展示多列子菜单的大型菜单。

## 何时使用

当需要在一个菜单项下展示大量分组链接、分类导航或功能入口时使用。MegaMenu 通过悬浮展开的面板，将多列子菜单分组呈现，适合电商分类、产品导航、后台功能集合等场景。

- 顶级菜单项数量较多且每项下有大量子链接。
- 需要按列、按分组组织子菜单内容。
- 需要水平或垂直两种布局。

## 基础用法

:::demo 通过 `model` 传入菜单数据，每个顶级项可包含多列子菜单。

mega-menu/basic

:::

## 垂直布局

:::demo 设置 `orientation` 为 `vertical`，菜单将纵向排列，子菜单面板从右侧展开。

mega-menu/vertical

:::

## 带图标

:::demo 顶级菜单项支持 `icon` 字段，可传入图标类名或 VNode。

mega-menu/with-icons

:::

## 多列子菜单

:::demo `items` 为二维数组，每个元素代表一列，列内可包含分组（带 `label` 与 `items`）或直接子项。

mega-menu/multi-column

:::

## 自定义面板内容

:::demo 通过 `start` / `end` 插槽在菜单两侧插入自定义内容，配合 `item` 插槽自定义菜单项渲染。

mega-menu/custom-content

:::

## API

### MegaMenu

| 参数                | 说明                 | 类型                                | 默认值       |
| ------------------- | -------------------- | ----------------------------------- | ------------ |
| model               | 菜单项数据数组       | MegaMenuItem[]                      | []           |
| orientation         | 菜单方向             | `horizontal` \| `vertical`          | `horizontal` |
| activeItem(v-model) | 当前激活的顶级项 key | string                              | -            |
| disabled            | 是否禁用整个菜单     | boolean                             | false        |
| prefixCls           | 自定义类名前缀       | string                              | -            |
| onItemClick         | 点击菜单项回调       | (e: MegaMenuItemClickEvent) => void | -            |

### MegaMenuItem

| 属性     | 说明                     | 类型                                           | 默认值 |
| -------- | ------------------------ | ---------------------------------------------- | ------ |
| key      | 项唯一标识               | string                                         | index  |
| label    | 项文本                   | string \| VNode                                | -      |
| icon     | 图标，字符串类名或 VNode | any                                            | -      |
| disabled | 是否禁用                 | boolean                                        | false  |
| url      | 跳转链接                 | string                                         | -      |
| target   | 链接打开方式             | string                                         | -      |
| items    | 多列子菜单，二维数组     | MegaMenuColumnGroup[][] \| MegaMenuSubItem[][] | -      |

### MegaMenuColumnGroup

| 属性  | 说明         | 类型              | 默认值 |
| ----- | ------------ | ----------------- | ------ |
| key   | 分组唯一标识 | string            | -      |
| label | 分组标题     | string \| VNode   | -      |
| items | 分组内子项   | MegaMenuSubItem[] | -      |

### MegaMenuSubItem

| 属性     | 说明         | 类型                                 | 默认值 |
| -------- | ------------ | ------------------------------------ | ------ |
| key      | 子项唯一标识 | string                               | -      |
| label    | 子项文本     | string \| VNode                      | -      |
| icon     | 图标         | any                                  | -      |
| disabled | 是否禁用     | boolean                              | false  |
| url      | 跳转链接     | string                               | -      |
| target   | 链接打开方式 | string                               | -      |
| command  | 点击命令回调 | (e: { item, originalEvent }) => void | -      |

### 事件

| 事件名称          | 说明                 | 回调参数                            |
| ----------------- | -------------------- | ----------------------------------- |
| itemClick         | 点击任意菜单项时触发 | (e: MegaMenuItemClickEvent) => void |
| update:activeItem | 激活项变化时触发     | (key: string) => void               |

### 插槽

| 插槽名      | 说明                   | 参数                                |
| ----------- | ---------------------- | ----------------------------------- |
| start       | 菜单起始位置自定义内容 | -                                   |
| end         | 菜单结束位置自定义内容 | -                                   |
| item        | 自定义菜单项渲染       | { item, label, hasSubmenu, active } |
| submenuicon | 自定义子菜单展开图标   | { active }                          |

### MegaMenuItemClickEvent

| 属性          | 说明       | 类型                            |
| ------------- | ---------- | ------------------------------- |
| key           | 菜单项 key | string                          |
| item          | 菜单项数据 | MegaMenuItem \| MegaMenuSubItem |
| originalEvent | 原生事件   | Event                           |
