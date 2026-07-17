/* eslint-disable no-console */
// 根据文档站和组件示例自动生成 llms.txt 与 llms-full.txt
// 数据源：apps/docs/components 下的 md 文件、apps/docs/examples 下的 vue 示例
// 输出：llms.txt、llms-full.txt（项目根目录与 apps/docs/public 各一份）
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const docsDir = resolve(rootDir, 'apps/docs/components');
const examplesDir = resolve(rootDir, 'apps/docs/examples');
const publicDir = resolve(rootDir, 'apps/docs/public');

const outputs = [
  resolve(rootDir, 'llms.txt'),
  resolve(rootDir, 'llms-full.txt'),
  resolve(publicDir, 'llms.txt'),
  resolve(publicDir, 'llms-full.txt'),
];

function toKebab(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function getDemoFiles(componentName) {
  const dir = resolve(examplesDir, componentName);
  if (!existsSync(dir)) return [];
  const stats = statSync(dir);
  if (!stats.isDirectory()) return [];
  return readdirSync(dir)
    .filter(name => extname(name) === '.vue')
    .map(name => basename(name, '.vue'))
    .sort();
}

function parseDoc(mdPath, componentName) {
  const content = readFileSync(mdPath, 'utf-8');
  const lines = content.split(/\r?\n/);

  const titleMatch = lines[0]?.match(/^#\s+(.+)$/);
  const title = titleMatch ? titleMatch[1].trim() : componentName;

  const descLines = [];
  let inDemo = false;
  const demos = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ') || line.startsWith('# ')) {
      inDemo = false;
      continue;
    }
    if (line.startsWith(':::demo')) {
      inDemo = true;
      continue;
    }
    if (line.startsWith(':::') && inDemo) {
      inDemo = false;
      continue;
    }
    if (inDemo) {
      const demoName = line.trim();
      if (demoName && !demoName.startsWith('<!--')) {
        demos.push(demoName);
      }
      continue;
    }
    if (line.trim() && !line.startsWith('- ') && !line.startsWith('* ')) {
      descLines.push(line.trim());
    }
  }

  const description = descLines.slice(0, 2).join(' ').replace(/\s+/g, ' ').trim();

  return {
    name: componentName,
    title,
    description,
    demos,
    content,
  };
}

function stripDemoBlocks(content) {
  const lines = content.split(/\r?\n/);
  const result = [];
  let inDemo = false;

  for (const line of lines) {
    if (line.startsWith(':::demo')) {
      inDemo = true;
      continue;
    }
    if (line.startsWith(':::') && inDemo) {
      inDemo = false;
      continue;
    }
    if (inDemo) continue;
    result.push(line);
  }

  return result.join('\n').trim();
}

function main() {
  if (!existsSync(docsDir)) {
    throw new Error(`Docs directory not found: ${docsDir}`);
  }
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  const mdFiles = readdirSync(docsDir)
    .filter(name => extname(name) === '.md')
    .map(name => basename(name, '.md'))
    .sort();

  const components = mdFiles.map(name => {
    const mdPath = resolve(docsDir, `${name}.md`);
    const doc = parseDoc(mdPath, name);
    const demos = getDemoFiles(name);
    return {
      ...doc,
      demos: demos.length ? demos : doc.demos,
      tag: `xy-${toKebab(name)}`,
      importPath: `xiaoye-ui/${name}`,
      docsPath: `/components/${name}.html`,
    };
  });

  const catalog = components
    .map(c => `- [${c.title}](${c.docsPath}) — 标签 \`<${c.tag}>\`，导入 \`${c.importPath}\``)
    .join('\n');

  const details = components
    .map(c => {
      const demoList = c.demos.length
        ? c.demos.map(d => `- ${d}: examples/${c.name}/${d}.vue`).join('\n')
        : '- 暂无示例';
      return `### ${c.title}

- 标签：\`<${c.tag}>\`
- 导入：\`${c.importPath}\`
- 文档：${c.docsPath}
- 说明：${c.description || '见文档详情'}
- 示例：
${demoList}`;
    })
    .join('\n\n');

  const llms = `# XiaoyeUI

> 基于 Vue 3 + TypeScript 的企业级 UI 组件库，组件标签统一使用 \`xy-\` 前缀。

## 快速开始

\`\`\`bash
# 安装主包
pnpm add xiaoye-ui

# 按需引入组件
import { XYButton } from 'xiaoye-ui';
import 'xiaoye-ui/button/style';
\`\`\`

## 组件目录

${catalog}

## 组件详情

${details}

## 开发规范

- 组件 \`name\` 使用 \`XYXxx\` 格式，标签使用 \`xy-xxx\` 格式。
- 图标必须从 \`@xiaoye-ui/icons\` 命名导入。
- 新增组件需补充文档 \`apps/docs/components/<component>.md\` 和示例 \`apps/docs/examples/<component>/\`。
- 全局注册使用 \`registerComponent\` 工具，禁止硬编码 \`xy-\` 标签名注册。

## 参考

- 项目仓库根目录的 \`AGENTS.md\` 包含完整开发规范。
- 文档站点路径：\`/components/<component-name>.html\`
`;

  const fullSections = components
    .map(c => {
      const body = stripDemoBlocks(c.content)
        .replace(/^#\s+.+\n?/, '')
        .trim();
      return `## ${c.title}

- 标签：\`<${c.tag}>\`
- 导入：\`${c.importPath}\`
- 文档：${c.docsPath}
${body ? `\n${body}` : ''}`;
    })
    .join('\n\n');

  const full = `# XiaoyeUI 完整 LLM 文档

> 本文档由 \`scripts/generate-llms-txt.mjs\` 根据 \`apps/docs/components/*.md\` 自动生成，供 LLM 完整消费组件库信息。

## 项目概述

XiaoyeUI 是一个基于 Vue 3 + TypeScript 的企业级 UI 组件库，采用 pnpm monorepo 架构。
组件标签统一使用 \`xy-\` 前缀，组件 \`name\` 使用 \`XYXxx\` 格式。

## 快速开始

\`\`\`bash
pnpm add xiaoye-ui
\`\`\`

\`\`\`typescript
import { XYButton } from 'xiaoye-ui';
import 'xiaoye-ui/button/style';
\`\`\`

## 组件目录

${catalog}

## 组件完整文档

${fullSections}

## AI 协作规范

- 组件标签统一使用 \`xy-\` 前缀，禁止使用 \`a-\` 前缀。
- 图标必须从 \`@xiaoye-ui/icons\` 命名导入。
- 全局注册使用 \`registerComponent\` 工具。
- 新增组件需补充文档、示例和单元测试。
`;

  writeFileSync(outputs[0], llms, 'utf-8');
  writeFileSync(outputs[1], full, 'utf-8');
  writeFileSync(outputs[2], llms, 'utf-8');
  writeFileSync(outputs[3], full, 'utf-8');

  for (const p of outputs) {
    console.log(`[generate-llms-txt] wrote ${p}`);
  }
  console.log(`[generate-llms-txt] ${components.length} components generated`);
}

main();
