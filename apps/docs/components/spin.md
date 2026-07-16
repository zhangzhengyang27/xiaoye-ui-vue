# Spin 加载中

用于页面和区块的加载中状态。

## 何时使用

页面局部处于等待异步数据或正在渲染过程时，合适的加载动效会有效缓解用户的焦虑。

## 基本用法

:::demo 一个简单的 loading 状态。

spin/basic

:::

## 各种大小

:::demo 小的用于文本加载，默认用于卡片容器级加载，大的用于**页面级**加载。

spin/size

:::

## 容器

:::demo 放入一个容器中。

spin/inside

:::

## 卡片加载中

:::demo 可以直接把内容内嵌到 `Spin` 中，将现有容器变为加载状态。

spin/nested

:::

## 自定义描述文案

:::demo 自定义描述文案。

spin/tip

:::

## 延迟

:::demo 延迟显示 loading 效果。当 spinning 状态在 `delay` 时间内结束，则不显示 loading 状态。

spin/delay

:::

## 自定义指示符

:::demo 使用自定义指示符。

spin/custom-indicator

:::

## API

|  参数  |  说明  |  类型  |  默认值  |  版本  |
| --- | --- | --- | --- | --- |
|  delay  |  延迟显示加载效果的时间（防止闪烁）  |  number (毫秒)  |  -  |    |
|  indicator  |  加载指示符  |  vNode \ |  slot  |  -  |    |
|  size  |  组件大小，可选值为 `small` `default` `large`  |  string  |  `default`  |    |
|  spinning  |  是否为加载中状态  |  boolean  |  true  |    |
|  tip  |  当作为包裹元素时，可以自定义描述文案  |  string \ |  slot  |  -  |  slot 3.0  |
|  wrapperClassName  |  包装器的类属性  |  string  |  -  |    |

### 静态方法

- `Spin.setDefaultIndicator({indicator})` 同上 `indicator`，你可以自定义全局默认元素

  ```jsx
  import { h } from 'vue';
  Spin.setDefaultIndicator({
    indicator: h('i', { class: 'anticon anticon-loading anticon-spin ant-spin-dot' }),
  });
  ```
