# BlockUI 阻塞 UI

用于阻塞指定区域或整个页面，常用于异步加载、表单提交、批量操作等场景，禁止用户在阻塞期间交互。

## 何时使用

- 异步请求期间需要禁止用户对区域内容进行点击、输入等交互。
- 长时间运行任务（如批量导入、数据处理）时给用户明确反馈。
- 表单提交过程中防止用户重复触发。
- 需要阻塞整个文档（视口）并锁定页面滚动。

## 基础用法

:::demo 通过 `blocked` 属性控制是否阻塞。阻塞时会显示遮罩 + 默认 Spin 加载图标。

block-ui/basic

:::

## 阻塞指定容器

:::demo 通过 `container` 属性指定阻塞目标容器。支持 `'body'`、CSS 选择器或 `HTMLElement`。不传时默认使用组件根元素。

block-ui/custom-target

:::

## 自定义文案与加载图标

:::demo 通过 `tip` 属性或 `#tip` 插槽自定义遮罩下方文案；通过 `#mask` 插槽完全自定义遮罩内容。

block-ui/with-spin

:::

## 阻塞整个文档

:::demo 设置 `fullScreen` 为 `true` 时，遮罩会以 `position: fixed` 挂到 `document.body`，并锁定 body 滚动，适合全局加载场景。

block-ui/document-block

:::

## 定时自动解除

:::demo 配合定时器在指定时间后自动解除阻塞，常用于模拟异步请求完成。

block-ui/auto-unblock

:::

## API

### BlockUI Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| blocked | 是否阻塞 | boolean | `false` |
| fullScreen | 是否阻塞整个文档（等同于 `container` 为 `'body'`，遮罩使用 `position: fixed` 并锁定 body 滚动） | boolean | `false` |
| container | 阻塞目标容器，支持 `'body'`、CSS 选择器或 `HTMLElement`。不传时使用组件根元素 | string \| HTMLElement | - |
| autoZIndex | 是否自动管理 z-index | boolean | `true` |
| baseZIndex | z-index 基准值（仅在 `autoZIndex` 为 `true` 时生效） | number | `0` |
| zIndex | 显式指定 z-index。设置后 `autoZIndex` 失效 | number | - |
| maskClassName | 遮罩自定义类名 | string | - |
| maskStyle | 遮罩自定义内联样式 | object | - |
| maskColor | 遮罩背景色（覆盖默认遮罩色） | string | - |
| tip | 遮罩下方加载文案（与 `#tip` 插槽二选一） | string \| vNode \| slot | - |
| prefixCls | 自定义类名前缀 | string | `xy-block-ui` |

### BlockUI Events

| 事件名  | 说明               | 回调参数 |
| ------- | ------------------ | -------- |
| block   | 进入阻塞状态时触发 | -        |
| unblock | 解除阻塞状态时触发 | -        |

### BlockUI Methods

通过 `ref` 可以获取组件实例并调用以下方法：

| 名称       | 说明                                   | 参数 |
| ---------- | -------------------------------------- | ---- |
| block()    | 主动阻塞                               | -    |
| unblock()  | 主动解除阻塞（会播放离场动画）         | -    |
| removeMask | 立即移除遮罩（跳过离场动画，强制清理） | -    |

### BlockUI Slots

| 插槽名  | 说明                                              | 参数 |
| ------- | ------------------------------------------------- | ---- |
| default | 被阻塞的内容                                      | -    |
| mask    | 完全自定义遮罩内部内容（设置后不再渲染默认 Spin） | -    |
| tip     | 自定义遮罩下方加载文案（与 `tip` 属性二选一）     | -    |

## FAQ

### BlockUI 与 Spin 的区别？

`Spin` 主要用于显示加载指示符，可选地包裹内容并模糊化显示；`BlockUI` 专注于**阻塞交互**——通过遮罩层完全阻止用户与目标区域的鼠标/键盘交互，并支持阻塞整个文档、锁定滚动等能力。两者可以配合使用：`BlockUI` 默认在遮罩内渲染 `Spin`。

### 如何阻塞整个页面？

设置 `fullScreen` 为 `true` 即可。组件会将遮罩以 `position: fixed` 挂到 `document.body` 上，并自动锁定 body 滚动。

### 如何阻塞组件外的某个元素？

使用 `container` 属性传入该元素的 CSS 选择器或 DOM 引用：

```html
<xy-block-ui blocked container="#my-card" />
```

注意：组件会自动将该元素设为 `position: relative`（如果原值为 `static`），以便遮罩正确定位。

### 阻塞期间焦点会被怎样处理？

全屏阻塞时，组件会主动调用 `document.activeElement.blur()` 移走焦点，避免用户通过键盘（Tab/Enter）继续操作底层元素。非全屏阻塞时不会主动处理焦点。

### 是否支持 SSR？

支持。组件内部对所有 `document` / `window` 访问都做了 SSR 安全判断，在服务端渲染时不会抛错，但遮罩只会在客户端水合后才能正常显示。
