# LLM / AI 使用指南

XiaoyeUI 为 AI 助手和 LLM 提供了结构化的项目信息，方便在编码、问答和生成组件代码时快速理解项目规范。

## 可用的 LLM 文档

文档站已托管以下两个文件，可通过对应 URL 访问：

- [`/llms.txt`](/llms.txt) — 精简版组件目录与快速开始指南
- [`/llms-full.txt`](/llms-full.txt) — 包含所有组件完整文档的详尽版本

## 在 AI 助手中使用

### 1. 引用项目规则文件

仓库根目录已配置多个 AI 编码助手规则文件，可根据你使用的工具选择对应文件：

| 文件                              | 适用工具                 |
| --------------------------------- | ------------------------ |
| `AGENTS.md`                       | Trae 及通用 AI Agent     |
| `.cursorrules`                    | Cursor                   |
| `.github/copilot-instructions.md` | GitHub Copilot / VS Code |
| `claude.md`                       | Claude Code              |

这些文件包含 XiaoyeUI 的硬性约定，例如：

- 组件标签统一使用 `xy-` 前缀
- 组件 `name` 属性使用 `XYXxx` 格式
- 图标必须从 `@xiaoye-ui/icons` 命名导入
- 新增组件的目录结构、Props 定义、样式开发、测试要求

### 2. 让 LLM 消费 llms.txt

在需要 AI 生成或修改组件代码时，可将 `llms.txt` 或 `llms-full.txt` 作为上下文附加给 LLM：

```text
请基于以下 XiaoyeUI 组件库文档，帮我实现一个 xy-switch 组件：

[粘贴 llms.txt 或 llms-full.txt 内容]
```

### 3. 结合组件源码提问

对于具体组件的使用或修改，建议同时提供：

- 组件文档：`apps/docs/components/<component>.md`
- 组件源码：`packages/xiaoye-ui/src/<component>/`
- 组件示例：`apps/docs/examples/<component>/`

## 重新生成 LLM 文档

当组件文档或示例更新后，执行以下命令重新生成：

```bash
pnpm generate:llms
```

该命令会同时更新：

- 项目根目录的 `llms.txt` / `llms-full.txt`
- 文档站 `apps/docs/public/llms.txt` / `llms-full.txt`

## 注意事项

- `llms.txt` 适用于快速检索组件目录和基础用法。
- `llms-full.txt` 体积较大，包含每个组件的完整 Markdown 文档，适合需要深度理解的场景。
- 生成脚本为 `scripts/generate-llms-txt.mjs`，数据源来自 `apps/docs/components/*.md` 和 `apps/docs/examples/*/*.vue`。
