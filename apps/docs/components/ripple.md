# Ripple 涟漪

Ripple 是一个包裹型组件，用于为任意元素添加 Material Design 风格的水波纹点击反馈。点击时从鼠标落点扩散出涟漪动画，提升交互反馈的清晰度。

## 何时使用

- 需要为自定义按钮、卡片、菜单项等可点击元素增加点击反馈时。
- 现有组件（如 Button）不满足视觉需求，需要更明显的点击扩散动效时。
- 需要统一控制整个应用的涟漪开关时，可结合 [ConfigProvider](/components/config-provider) 使用。

## 基础用法

:::demo 使用 `xy-ripple` 包裹任意元素，点击时即会从点击位置扩散出涟漪效果。

ripple/basic

:::

## 自定义颜色

:::demo 涟漪默认颜色为半透明黑色。通过覆盖 `.xy-ripple__ink` 的 `background` 样式可自定义不同颜色的涟漪。

ripple/custom-color

:::

## 禁用涟漪

:::demo 通过 `disabled` 属性可单独关闭某个 Ripple 的涟漪效果，适用于在特定状态下需要禁用动效的场景。

ripple/disabled

:::

## 与图标配合

:::demo Ripple 可包裹图标按钮、卡片等任意可点击元素，点击任意位置都会触发涟漪扩散。

ripple/with-icon

:::

## 全局控制

:::demo 通过 [ConfigProvider](/components/config-provider) 的 `ripple` 属性可统一控制其内部所有 Ripple 组件的启用状态，无需逐个设置 `disabled`。

ripple/global-config

:::

## API

### Ripple Props

| 属性     | 说明             | 类型    | 默认值  |
| -------- | ---------------- | ------- | ------- |
| disabled | 是否禁用涟漪效果 | boolean | `false` |

### Ripple Slots

| 插槽名  | 说明                   |
| ------- | ---------------------- |
| default | 需要添加涟漪效果的内容 |

### 全局配置

可通过 `ConfigProvider` 的 `ripple` 属性全局控制涟漪启用状态：

```vue
<xy-config-provider :ripple="false">
  <!-- 内部所有 xy-ripple 都不会触发涟漪 -->
</xy-config-provider>
```

### 样式说明

- 组件会渲染一个 `span.xy-ripple` 容器，并自动为目标元素添加 `position: relative` 与 `overflow: hidden`。
- 涟漪元素类名为 `.xy-ripple__ink`，可通过覆盖其 `background` 自定义涟漪颜色。
- 涟漪动画时长固定为 0.4s，由 `xy-ripple-animation` 关键帧驱动。

### 内部使用建议

对于内部组件，推荐直接使用 `useRipple(ref)` composable，可避免额外的 DOM 层级：

```ts
import { ref } from 'vue';
import { useRipple } from 'xiaoye-ui/ripple';

const btnRef = ref<HTMLElement>();
useRipple(btnRef);
```
