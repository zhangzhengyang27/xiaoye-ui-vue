# ContextMenu 右键菜单

在页面指定区域显示右键菜单，支持多级子菜单、图标、键盘导航和分隔符。

## 何时使用

当需要在用户右键点击时展示一组操作命令，可以使用右键菜单组件。

- 文件管理器、表格行操作等需要上下文操作的场景。
- 需要多级子菜单收纳操作命令。
- 需要全局右键菜单或仅特定区域触发的右键菜单。

## 基础用法

:::demo 通过 `model` 属性配置菜单项，设置 `global` 为 `true` 后会在整个页面监听右键事件。菜单项可通过 `separator` 设置分隔符，通过 `disabled` 设置禁用状态，通过 `command` 回调响应点击。

context-menu/basic

:::

## 多级子菜单

:::demo 菜单项通过 `items` 字段嵌套子菜单项，支持任意层级的子菜单。鼠标悬停或按右方向键可展开子菜单。

context-menu/with-submenu

:::

## 带图标菜单

:::demo 通过 `#itemicon` 插槽可以自定义菜单项图标，插槽参数为当前菜单项 `item`。图标必须从 `@xiaoye-ui/icons` 命名导入。

context-menu/with-icons

:::

## 自定义触发目标

:::demo 不设置 `global` 时，组件不会自动监听右键事件。可通过 `ref` 获取组件实例后调用 `show(event)` 方法，实现仅在某些区域右键时才弹出菜单。

context-menu/custom-target

:::

## 事件处理

:::demo 组件提供 `before-show`、`show`、`before-hide`、`hide` 四个生命周期事件。菜单项点击通过 `command` 回调响应，回调参数为 `{ originalEvent, item }`。

context-menu/events

:::

## API

### ContextMenu Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 菜单项数组 | [MenuItem](#menuitem)[] | - |
| global | 是否全局监听 document 的右键事件 | boolean | `false` |
| appendTo | 菜单挂载位置，可选 `body`、`self`、CSS 选择器或 HTMLElement | string \| HTMLElement | `'body'` |
| autoZIndex | 是否自动管理 z-index | boolean | `true` |
| baseZIndex | z-index 基准值 | number | `0` |
| breakpoint | 响应式断点，小于该宽度进入移动端模式 | string | `'960px'` |
| tabindex | tabindex 属性 | number \| string | `0` |
| ariaLabelledby | aria-labelledby 属性 | string | - |
| ariaLabel | aria-label 属性 | string | - |

### ContextMenu Events

| 事件名      | 说明               | 回调参数            |
| ----------- | ------------------ | ------------------- |
| before-show | 菜单即将显示时触发 | -                   |
| show        | 菜单显示后触发     | -                   |
| before-hide | 菜单即将隐藏时触发 | -                   |
| hide        | 菜单隐藏后触发     | -                   |
| focus       | 菜单获得焦点时触发 | (event: FocusEvent) |
| blur        | 菜单失去焦点时触发 | (event: FocusEvent) |

### ContextMenu Methods

通过 `ref` 可以获取组件实例并调用以下方法：

| 名称          | 说明               | 参数                |
| ------------- | ------------------ | ------------------- |
| show(event)   | 在指定坐标显示菜单 | (event: MouseEvent) |
| hide()        | 隐藏菜单           | -                   |
| toggle(event) | 切换菜单显示状态   | (event: MouseEvent) |

### ContextMenu Slots

| 插槽名      | 说明                 | 参数                               |
| ----------- | -------------------- | ---------------------------------- |
| itemicon    | 自定义菜单项图标     | { item }                           |
| item        | 自定义菜单项整体渲染 | { item, hasSubmenu, label, props } |
| submenuicon | 自定义子菜单展开图标 | { active }                         |

### MenuItem

菜单项数据结构，每个菜单项可包含以下字段：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 菜单项标签，支持函数式 | string \| ((...args: any) => string) | - |
| icon | 图标类名（字符串），如需使用图标组件请通过 `#itemicon` 插槽 | any | - |
| items | 子菜单项数组，存在该字段时该项作为子菜单触发器 | MenuItem[] | - |
| disabled | 是否禁用 | boolean | `false` |
| visible | 是否可见 | boolean | `true` |
| separator | 是否为分隔符（为 `true` 时只渲染分隔线） | boolean | `false` |
| url | 跳转 URL，设置后菜单项渲染为 `<a>` 链接 | string | - |
| target | 链接 target 属性，配合 `url` 使用 | string | - |
| to | 路由跳转目标 | string \| object | - |
| command | 点击回调函数 | (options: { originalEvent: Event; item: MenuItem }) => void | - |
| style | 自定义样式 | any | - |
| class | 自定义类名 | any | - |

## FAQ

### 如何只让特定区域触发右键菜单？

不要设置 `global` 为 `true`，改为通过 `ref` 获取组件实例，在目标元素上监听 `@contextmenu` 事件并调用 `show(event)` 方法。参考「自定义触发目标」示例。

### 全局右键菜单会与浏览器默认右键菜单冲突吗？

设置 `global` 为 `true` 后，组件会调用 `event.preventDefault()` 阻止浏览器默认右键菜单，因此不会冲突。

### 如何使用图标组件而非图标类名？

通过 `#itemicon` 插槽传入图标组件即可，参考「带图标菜单」示例。注意图标必须从 `@xiaoye-ui/icons` 命名导入。
