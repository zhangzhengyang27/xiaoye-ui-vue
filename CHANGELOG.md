# 更新日志

本项目所有 notable 变更都会记录在此文件中。

## 6.0.0

- 基于 ant-design-vue 重构为 pnpm monorepo，主包迁移至 `packages/xiaoye-ui`
- 组件 CSS 类名前缀由 `ant-` 统一迁移为 `xy-`
- 新增 `@xiaoye-ui/icons`、`@xiaoye-ui/utils`、`@xiaoye-ui/metadata`、`@xiaoye-ui/vite-plugin`、`@xiaoye-ui/auto-import-resolver`、`@xiaoye-ui/nuxt-module`、`@xiaoye-ui/mcp` 等子包
- 文档站点迁移至 VitePress（`apps/docs`）
- 构建链迁移至 Vite 7 库模式（ESM-only）
