# Empty 空状态

空状态时的展示占位图。

## 何时使用

- 当目前没有数据时，用于显式的用户提示。
- 初始化场景时的引导创建流程。

## 基本用法

:::demo 简单的展示。

empty/basic

:::

## 无描述

:::demo 无描述展示。

empty/description

:::

## 选择图片

:::demo 可以通过设置 `image` 为 `Empty.PRESENTED_IMAGE_SIMPLE` 选择另一种风格的图片。

empty/simple

:::

## 自定义

:::demo 自定义图片、描述、附属内容。

empty/customize

:::

## 全局化配置

:::demo 自定义全局组件的 Empty 样式。

empty/config-provider

:::

## API

```jsx
<Empty>
  <Button>创建</Button>
</Empty>
```

|  参数         |  说明                                          |  类型              |  默认值  |  版本  |
| ----------- | -------------------------------------------- | ---------------- | ------ | ---- |
|  description  |  自定义描述内容                                |  string \ |  v-slot  |  -       |        |
|  image        |  设置显示图片，为 string 时表示自定义图片地址  |  string \ |  v-slot  |  false   |        |
|  imageStyle   |  图片样式                                      |  CSSProperties     |  -       |        |

## 内置图片

- Empty.PRESENTED_IMAGE_SIMPLE

  <img src="https://user-images.githubusercontent.com/507615/54591679-b0ceb580-4a65-11e9-925c-ad15b4eae93d.png" height="35px" />

- Empty.PRESENTED_IMAGE_DEFAULT

  <img src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" height="100px" />
