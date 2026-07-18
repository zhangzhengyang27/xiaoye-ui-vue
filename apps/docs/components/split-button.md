# SplitButton 分割按钮

把多个操作命令收纳到一个按钮组中，左侧为主操作按钮，右侧为下拉触发按钮。

## 何时使用

当一组操作中有一个主要命令，同时还有多个次要命令时使用：

- 左侧按钮执行最常用的操作。
- 右侧按钮展开下拉菜单，承载其余操作。
- 适用于保存、导出、更多设置等场景。

## 基本

:::demo 通过 `label` 设置主按钮文字，`model` 配置下拉菜单项。

split-button/basic

:::

## 按钮类型

:::demo 支持与 [Button](/components/button) 一致的 `type` 属性：`primary`、`dashed`、`ghost`、`text`、`link`。

split-button/types

:::

## 带图标

:::demo 通过 `icon` 属性为左侧主按钮设置图标。

split-button/with-icon

:::

## 禁用状态

:::demo 设置 `disabled` 后，主按钮与下拉触发按钮均不可点击。

split-button/disabled

:::

## 按钮尺寸

:::demo 通过 `size` 设置 `large`、`middle`、`small` 三种尺寸。

split-button/sizes

:::

## 自定义菜单

:::demo 使用 `overlay` 插槽完全自定义下拉菜单内容，可嵌入 [Menu](/components/menu) 或任意内容。

split-button/custom-menu

:::

## API

### SplitButton

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 按钮类型，和 [Button](/components/button) 一致 | `default` \| `primary` \| `ghost` \| `dashed` \| `text` \| `link` | `default` |  |
| size | 按钮尺寸，和 [Button](/components/button) 一致 | `large` \| `middle` \| `small` | `middle` |  |
| disabled | 是否禁用（同时禁用主按钮与下拉按钮） | boolean | `false` |  |
| loading | 是否加载中 | boolean \| { delay: number } | `false` |  |
| danger | 是否为危险按钮 | boolean | `false` |  |
| ghost | 是否幽灵按钮 | boolean | `false` |  |
| label | 主按钮文字 | string | - |  |
| icon | 主按钮图标 | VNode \| slot | - |  |
| model | 下拉菜单项数据 | SplitButtonItem[] | - |  |
| menuClass | 菜单自定义类名 | string | - |  |
| trigger | 下拉触发方式 | `click` \| `hover` \| `contextmenu` \| Array | `hover` |  |
| placement | 菜单弹出位置 | `bottomLeft` \| `bottom` \| `bottomRight` \| `topLeft` \| `top` \| `topRight` | `bottomRight` |  |
| arrow | 下拉框箭头是否显示 | boolean | `false` |  |
| prefixCls | 自定义类名前缀 | string | - |  |

### SplitButtonItem

`model` 数组中每一项的数据结构：

| 参数     | 说明                   | 类型                         | 默认值  |
| -------- | ---------------------- | ---------------------------- | ------- |
| key      | 菜单项唯一标识         | string \| number             | -       |
| label    | 菜单项文本             | string \| (() => VNodeChild) | -       |
| icon     | 菜单项图标             | VNode                        | -       |
| disabled | 是否禁用               | boolean                      | `false` |
| danger   | 是否为危险项           | boolean                      | `false` |
| divided  | 是否在该项前显示分割线 | boolean                      | `false` |
| title    | 鼠标悬浮提示           | string                       | -       |
| children | 子菜单项（多级菜单）   | SplitButtonItem[]            | -       |

### 事件

| 事件名称   | 说明                   | 回调参数                                |
| ---------- | ---------------------- | --------------------------------------- |
| click      | 点击左侧主按钮时触发   | (e: MouseEvent) => void                 |
| itemClick  | 点击菜单项时触发       | (info: { key, item, domEvent }) => void |
| openChange | 菜单显示状态改变时触发 | (open: boolean) => void                 |

### 插槽

| 插槽名  | 说明                                     |
| ------- | ---------------------------------------- |
| default | 主按钮内容（优先级高于 `label`）         |
| icon    | 主按钮图标                               |
| overlay | 自定义下拉菜单内容（优先级高于 `model`） |
