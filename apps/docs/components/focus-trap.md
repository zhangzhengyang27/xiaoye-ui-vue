# FocusTrap 焦点陷阱

将键盘焦点限制在组件子树内，Tab / Shift+Tab 不会跳出边界，常用于模态对话框、抽屉、全屏遮罩等需要锁定焦点的场景。

## 何时使用

- 模态对话框、全屏遮罩打开时，需要把焦点锁定在弹层内部。
- 抽屉、Lightbox 等组件需要保证键盘用户无法通过 Tab 离开当前交互区域。
- 需要满足无障碍（WCAG）焦点管理要求的场景。

## 基础用法

:::demo 用 `xy-focus-trap` 包裹对话框内容，Tab 键循环不会跳出对话框边界。打开对话框后焦点会自动进入首个可聚焦元素。

focus-trap/basic

:::

## 禁用陷阱

:::demo 通过 `disabled` 属性可动态关闭焦点陷阱。关闭后，焦点可以离开子树，便于在条件场景下切换交互模式。

focus-trap/disabled

:::

## 自动聚焦指定元素

:::demo 默认情况下 `autoFocus` 为 `true`，会自动聚焦首个可聚焦元素。可通过 `autoFocusSelector` 指定一个 CSS 选择器，让特定元素在打开时获得焦点。

focus-trap/auto-focus

:::

## 自定义可聚焦元素

:::demo 通过 `firstFocusableSelector` 与 `lastFocusableSelector` 可显式指定首/尾可聚焦元素，绕过默认的 DOM 顺序查询，适用于需要自定义 Tab 循环边界的场景。

focus-trap/selectors

:::

## API

### FocusTrap Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| disabled | 是否禁用焦点陷阱 | boolean | `false` |
| autoFocus | 是否自动聚焦首个可聚焦元素 | boolean | `true` |
| autoFocusSelector | 自动聚焦元素的 CSS 选择器；为空时使用首个可聚焦元素 | string | `''` |
| firstFocusableSelector | 首个可聚焦元素的 CSS 选择器 | string | `''` |
| lastFocusableSelector | 末尾可聚焦元素的 CSS 选择器 | string | `''` |
| tabIndex | 容器自身的 tabindex | number | `0` |
| onFocusIn | 焦点进入子树时触发 | (event: FocusEvent) => void | - |
| onFocusOut | 焦点离开子树时触发 | (event: FocusEvent) => void | - |

### 用法说明

```vue
<template>
  <xy-focus-trap :auto-focus="true" auto-focus-selector=".first-input">
    <div role="dialog" aria-modal="true">
      <input class="first-input" />
      <button>确定</button>
    </div>
  </xy-focus-trap>
</template>
```

## FAQ

### 为什么我看不到 `xy-focus-trap` 的视觉样式？

FocusTrap 是一个无样式的逻辑组件，仅负责焦点管理，不会渲染任何可见 UI。你需要自行实现对话框、遮罩等外观。

### `autoFocusSelector` 与 `firstFocusableSelector` 有何区别？

`autoFocusSelector` 决定打开时哪个元素获得焦点；`firstFocusableSelector` / `lastFocusableSelector` 决定 Tab 循环的边界。前者只影响初始焦点位置，后者影响整个 Tab 循环行为。
