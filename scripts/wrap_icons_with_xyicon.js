const fs = require('fs');
const path = require('path');

const iconsDir = path.resolve(__dirname, '../packages/icons/src');
const dryRun = process.argv.includes('--dry-run');

function findVueFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findVueFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.vue') && entry.name !== 'BaseIcon.vue') {
      files.push(fullPath);
    }
  }
  return files;
}

const vueFiles = findVueFiles(iconsDir);
let modifiedCount = 0;
let skippedCount = 0;

for (const file of vueFiles) {
  const content = fs.readFileSync(file, 'utf-8');

  if (content.includes('class="xyicon"') || content.includes("class='xyicon'")) {
    skippedCount++;
    continue;
  }

  const templateMatch = content.match(/(<template>\s*\n)(\s*)(<svg[\s\S]*?<\/svg>)(\s*\n<\/template>)/);
  if (!templateMatch) {
    skippedCount++;
    continue;
  }

  const templateOpen = templateMatch[1];
  const baseIndent = templateMatch[2];
  const svgBlock = templateMatch[3];
  const templateClose = templateMatch[4];

  // 增加 svg 内部每一行的缩进（再缩进 2 个空格）
  const indentedSvg = svgBlock
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : (line ? baseIndent + line : line)))
    .join('\n');

  const wrappedBlock = `<span class="xyicon">\n${baseIndent}${indentedSvg}\n${baseIndent}</span>`;

  const newContent = content.replace(
    templateMatch[0],
    `${templateOpen}${baseIndent}${wrappedBlock}${templateClose}`
  );

  if (newContent !== content) {
    if (!dryRun) {
      fs.writeFileSync(file, newContent, 'utf-8');
    }
    modifiedCount++;
  } else {
    skippedCount++;
  }
}

console.log(`Total .vue icon files: ${vueFiles.length}`);
console.log(`Modified: ${modifiedCount}`);
console.log(`Skipped: ${skippedCount}`);
if (dryRun) {
  console.log('(Dry run: no files were changed)');
}
