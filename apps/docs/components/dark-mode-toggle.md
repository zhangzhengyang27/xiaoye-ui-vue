# DarkModeToggle 暗色模式切换

用于在亮色 / 暗色模式之间快速切换的组件，内置太阳 / 月亮图标，支持按钮与开关两种风格。

## 何时使用

- 需要为用户提供一键切换暗色 / 亮色主题的入口；
- 需要把状态同步到 `document.documentElement` 的 `data-theme` 属性，配合 CSS 变量主题使用；
- 需要一个独立的 composable（`useDarkMode`）在任意位置读取 / 修改暗色模式状态。

## 基础用法

:::demo 默认圆形按钮风格，点击在亮色 / 暗色之间切换，自动同步到 `data-theme` 属性。

dark-mode-toggle/basic

:::

## 开关风格

:::demo 通过 `variant="switch"` 使用开关风格，左右两侧分别显示月亮与太阳图标。

dark-mode-toggle/with-switch

:::

## 自定义图标

:::demo 通过 `sun-icon` / `moon-icon` 属性或同名插槽自定义两侧图标。

dark-mode-toggle/custom-icon

:::

## 受控用法

:::demo 使用 `v-model:dark` 进行双向绑定，组件状态完全由外部控制。

dark-mode-toggle/controlled

:::

## 配合 ConfigProvider

:::demo 配合 `ConfigProvider` 的 `theme.token.algorithm` 实现完整的暗色主题切换。

dark-mode-toggle/with-config-provider

:::

## API

### DarkModeToggle Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| dark(v-model) | 当前是否为暗色模式，支持 `v-model:dark` | boolean | - |  |
| defaultDark | 初始是否为暗色模式（非受控模式下生效） | boolean | false |  |
| variant | 外观风格：`button` 圆形按钮 \| `switch` 开关 | string | `button` |  |
| size | 组件尺寸：`small` \| `default` \| `large` | string | `default` |  |
| sunIcon | 亮色模式下显示的图标 | VNode \| slot | `<SunIcon />` |  |
| moonIcon | 暗色模式下显示的图标 | VNode \| slot | `<MoonIcon />` |  |
| disabled | 是否禁用 | boolean | false |  |
| applyToDocument | 是否同步状态到 `document.documentElement` 的 `data-theme` 属性 | boolean | true |  |
| followSystem | 是否跟随系统 `prefers-color-scheme`（仅非受控模式下生效） | boolean | false |  |

### DarkModeToggle Events

| 事件名称    | 说明                      | 回调参数                    | 版本 |
| ----------- | ------------------------- | --------------------------- | ---- |
| change      | 暗色模式变化时触发        | `(isDark: boolean) => void` |      |
| update:dark | `v-model:dark` 触发的事件 | `(isDark: boolean) => void` |      |

### DarkModeToggle Methods

| 名称    | 描述     |
| ------- | -------- |
| focus() | 获取焦点 |
| blur()  | 移除焦点 |

### DarkModeToggle Slots

| 名称     | 说明               |
| -------- | ------------------ |
| sunIcon  | 自定义亮色模式图标 |
| moonIcon | 自定义暗色模式图标 |

## useDarkMode() Composable

独立的暗色模式状态管理 composable，可在任意 setup 函数中使用。

```ts
import { useDarkMode } from 'xiaoye-ui';

const { isDark, toggle, setDark } = useDarkMode({
  initialValue: false,
  applyToDocument: true,
  followSystem: false,
});
```

### UseDarkModeOptions

| 参数            | 说明                                | 类型    | 默认值                         |
| --------------- | ----------------------------------- | ------- | ------------------------------ |
| initialValue    | 初始是否为暗色模式                  | boolean | 读取 `data-theme` 属性 / false |
| applyToDocument | 是否同步状态到 `data-theme` 属性    | boolean | true                           |
| followSystem    | 是否跟随系统 `prefers-color-scheme` | boolean | false                          |

### UseDarkModeReturn

| 参数    | 说明                | 类型                      |
| ------- | ------------------- | ------------------------- |
| isDark  | 当前是否为暗色模式  | `Ref<boolean>`            |
| toggle  | 切换暗色 / 亮色模式 | `() => void`              |
| setDark | 直接设置暗色模式    | `(dark: boolean) => void` |
