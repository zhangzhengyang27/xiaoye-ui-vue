# Comment 评论

对网站内容的反馈、评价和讨论。

## 何时使用

评论组件可用于对事物的讨论，例如页面、博客文章、问题等等。

## 基本评论

:::demo 一个基本的评论组件，带有作者、头像、时间和操作。

comment/basic

:::

## 配合 List 组件

:::demo 配合 List 组件展现评论列表。

comment/list

:::

## 嵌套评论

:::demo 评论可以嵌套。

comment/nested

:::

## 回复框

:::demo 评论编辑器组件提供了相同样式的封装以支持自定义评论编辑器。

comment/editor

:::

## API

|  Property  |  Description                                                  |  Type          |  Default  |
| -------- | ----------------------------------------------------------- | ------------ | ------- |
|  actions   |  在评论内容下面呈现的操作项列表                               |  Array\ | slot   |  -        |
|  author    |  要显示为注释作者的元素                                       |  string\ | slot  |  -        |
|  avatar    |  要显示为评论头像的元素 - 通常是 xiaoye-ui `Avatar` 或者 src  |  string\ | slot  |  -        |
|  content   |  评论的主要内容                                               |  string\ | slot  |  -        |
|  datetime  |  展示时间描述                                                 |  string\ | slot  |  -        |
