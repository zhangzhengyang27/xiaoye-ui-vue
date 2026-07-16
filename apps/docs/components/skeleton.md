# Skeleton 骨架屏

在需要等待加载内容的位置提供一个占位图形组合。

## 何时使用

- 网络较慢，需要长时间等待加载处理的情况下。
- 图文信息内容较多的列表/卡片中。
- 只在第一次加载数据的时候使用。
- 可以被 Spin 完全代替，但是在可用的场景下可以比 Spin 提供更好的视觉效果和用户体验。

## 基本用法

:::demo 最简单的占位效果。

skeleton/basic

:::

## 复杂的组合

:::demo 更复杂的组合。

skeleton/complex

:::

## 动画效果

:::demo 显示动画效果。

skeleton/active

:::

## 按钮/头像/输入框/图像

:::demo 骨架按钮、头像、输入框和图像。

skeleton/element

:::

## 包含子组件

:::demo 加载占位图包含子组件。

skeleton/children

:::

## 列表

:::demo 在列表组件中使用加载占位符。

skeleton/list

:::

## API

### Skeleton

|  属性  |  说明  |  类型  |  默认值  |
| --- | --- | --- | --- |
|  active  |  是否展示动画效果  |  boolean  |  false  |
|  avatar  |  是否显示头像占位图  |  boolean \ |  [SkeletonAvatarProps](#skeletonavatarprops)  |  false  |
|  loading  |  为 `true` 时，显示占位图。反之则直接展示子组件  |  boolean  |  -  |
|  paragraph  |  是否显示段落占位图  |  boolean \ |  [SkeletonParagraphProps](#skeletonparagraphprops)  |  true  |
|  title  |  是否显示标题占位图  |  boolean \ |  [SkeletonTitleProps](#skeletontitleprops)  |  true  |

### SkeletonAvatarProps

|  属性   |  说明                  |  类型                                       |  默认值  |
| ----- | -------------------- | ----------------------------------------- | ------ |
|  shape  |  指定头像的形状        |  `circle` \ |  `square`                       |  -       |
|  size   |  设置头像占位图的大小  |  number \ |  `large` \ |  `small` \ |  `default`  |  -       |

### SkeletonTitleProps

|  属性   |  说明                  |  类型              |  默认值  |
| ----- | -------------------- | ---------------- | ------ |
|  width  |  设置标题占位图的宽度  |  number \ |  string  |  -       |

### SkeletonParagraphProps

|  属性  |  说明  |  类型  |  默认值  |
| --- | --- | --- | --- |
|  rows  |  设置段落占位图的行数  |  number  |  -  |
|  width  |  设置段落占位图的宽度，若为数组时则为对应的每行宽度，反之则是最后一行的宽度  |  number \ |  string \ |  Array&lt;number \ |  string>  |  -  |

### SkeletonButtonProps (3.0+)

|  属性    |  说明                            |  类型                              |  默认值  |  版本  |
| ------ | ------------------------------ | -------------------------------- | ------ | ---- |
|  active  |  是否展示动画效果                |  boolean                           |  false   |        |
|  block   |  将按钮宽度调整为其父宽度的选项  |  boolean                           |  false   |        |
|  shape   |  指定按钮的形状                  |  `circle` \ |  `round` \ |  `default`  |  -       |        |
|  size    |  设置按钮的大小                  |  `large` \ |  `small` \ |  `default`   |  -       |        |

### SkeletonInputProps (3.0+)

|  属性    |  说明              |  类型                             |  默认值  |
| ------ | ---------------- | ------------------------------- | ------ |
|  active  |  是否展示动画效果  |  boolean                          |  false   |
|  size    |  设置输入框的大小  |  `large` \ |  `small` \ |  `default`  |  -       |
