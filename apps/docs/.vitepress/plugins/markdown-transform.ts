import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// .vitepress/plugins -> docs
const docRoot = path.resolve(__dirname, '..');

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>;

export function MarkdownTransform(): Plugin {
  return {
    name: 'xiaoye-ui-md-transform',

    enforce: 'pre',

    transform(code, id) {
      if (!id.endsWith('.md')) return;

      // 只对组件文档注入示例 import，避免破坏首页、指南等含 front matter 的页面
      const componentsDir = path.resolve(docRoot, 'components');
      if (path.dirname(id) !== componentsDir) return;

      const componentId = path.basename(id, '.md');
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: getExampleImports(componentId),
      };

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers,
      );
    },
  };
}

const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
${codes.join('\n')}
</script>
`;

const combineMarkdown = (code: string, headers: string[], footers: string[]) => {
  const frontmatterEnds = code.indexOf('---\n\n');
  const firstHeader = code.search(/\n#{1,6}\s.+/);
  const sliceIndex =
    firstHeader < 0 ? (frontmatterEnds < 0 ? 0 : frontmatterEnds + 4) : firstHeader;

  if (headers.length > 0)
    code = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex);
  code += footers.join('\n');

  return `${code}\n`;
};

const getExampleImports = (componentId: string) => {
  const examplePath = path.resolve(docRoot, 'examples', componentId);
  if (!fs.existsSync(examplePath)) return [];
  const files = fs.readdirSync(examplePath);
  const imports: string[] = [];

  for (const item of files) {
    if (!/\.vue$/.test(item)) continue;
    const file = item.replace(/\.vue$/, '');
    const name = `xy-${componentId}-${file}`;

    imports.push(`import ${name} from '/examples/${componentId}/${file}.vue'`);
  }

  return imports;
};
