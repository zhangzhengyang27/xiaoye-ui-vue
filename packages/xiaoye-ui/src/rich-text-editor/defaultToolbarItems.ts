import type { EditorToolbarItem } from './RichTextEditorToolbar';

/**
 * SVG 图标常量（lucide 风格，size 15x15，viewBox 0 0 24 24）
 *
 * 图标源参考 lucide.dev（https://lucide.dev/icons/），通过 iconify API 获取原始 path。
 * 项目希望减少依赖，因此使用内联 SVG 字符串而非外部图标库。
 */
const ICONS = {
  // 历史操作
  undo: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9a9 9 0 0 0-6 2.3L3 13"/></svg>',
  redo: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9a9 9 0 0 1 6 2.3l3 2.7"/></svg>',

  // 标题
  heading:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h12M6 20V4m12 16V4"/></svg>',
  heading1:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8m-8 6V6m8 12V6m5 6l3-2v8"/></svg>',
  heading2:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8m-8 6V6m8 12V6m9 12h-4c0-4 4-3 4-6c0-1.5-2-2.5-4-1"/></svg>',
  heading3:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8m-8 6V6m8 12V6m5.5 4.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2m-2 3.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>',
  heading4:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18V6m5 4v3a1 1 0 0 0 1 1h3m0-4v8M4 12h8m-8 6V6"/></svg>',

  // 列表
  list: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13"/></svg>',
  bulletList:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13"/></svg>',
  orderedList:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5h10m-10 7h10m-10 7h10M4 4h1v5M4 9h2m.5 11H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02"/></svg>',
  taskList:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5h8m-8 7h8m-8 7h8M3 17l2 2l4-4M3 7l2 2l4-4"/></svg>',

  // 块类型
  quote:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 5H3m18 7H8m13 7H8m-5-7v7"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18l6-6l-6-6M8 6l-6 6l6 6"/></svg>',
  codeBlock:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m10 9l-3 3l3 3m4 0l3-3l-3-3"/></svg>',
  minus:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',

  // 文本格式
  bold: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>',
  italic:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 4h-9m4 16H5M15 4L9 20"/></svg>',
  underline:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/></svg>',
  strike:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6m-2-8h16"/></svg>',

  // 链接 / 图片
  link: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  image:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',

  // 表格
  table:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18"/></svg>',
  columnBefore:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19V5m10 1l-6 6l6 6m-6-6h14"/></svg>',
  columnAfter:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12H3m8 6l6-6l-6-6m10-1v14"/></svg>',
  columnDelete:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  rowBefore:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14m-1 10l-6-6l-6 6m6-6v14"/></svg>',
  rowAfter:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17V3m-6 8l6 6l6-6m1 10H5"/></svg>',
  rowDelete:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  merge:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="3" rx="1"/><path d="M14 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1m5-7a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1M7 15l3 3m-3 3l3-3H5a2 2 0 0 1-2-2v-2"/></svg>',
  split:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3m8 0h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3M12 4v16"/></svg>',
  tableHeader:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>',
  tableHeaderColumn:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14v2m0 4v2m0-20v2m0 4v2M2 15h8M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2M2 9h8m12 6h-4m4-12h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2m0-12h-4M5 3v18"/></svg>',
  tableHeaderCell:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18m6-18v18"/></svg>',

  // 下拉箭头
  chevronDown:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9l6 6l6-6"/></svg>',

  // 对齐
  alignLeft:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12H3m14 6H3M21 6H3"/></svg>',
  alignCenter:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12H7m12 6H5M21 6H3"/></svg>',
  alignRight:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12H9m12 6H7M21 6H3"/></svg>',
  alignJustify:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 18h18M3 6h18"/></svg>',

  // 颜色
  palette:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20a10 9 0 0 1 10 9a5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
  highlighter:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11l-6 6v3h9l3-3"/><path d="m22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>',

  // 清除格式
  removeFormatting:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M5 20h6m2-16L8 20m7-5l5 5m0-5l-5 5"/></svg>',
};

/**
 * 默认工具栏 items 配置
 *
 * 共 7 组工具栏按钮，组间会自动渲染 Separator：
 *   1. 历史操作（撤销 / 重做）
 *   2. 块类型（标题 / 列表 / 引用 / 代码块 / 分割线）
 *   3. 文本格式（加粗 / 斜体 / 下划线 / 删除线 / 行内代码）
 *   4. 链接 / 图片 / 表格
 *   5. 文本对齐
 *   6. 文本颜色 / 高亮
 *   7. 清除格式
 *
 * 说明：
 * - tooltip.shortcuts 字段当前项目的 EditorToolbarItem 类型未显式声明，
 *   但运行时不影响功能；当类型扩展后可自动启用快捷键提示。
 * - 1:1 复刻 ui-4：文本格式项使用 kind: 'mark' + mark 字段，不使用独立 'bold'/'italic' 等 kind。
 * - dropdown 内可包含 `{ type: 'separator' }` 用于分组分隔。
 */
export const defaultToolbarItems = [
  // 1. 历史操作
  [
    {
      kind: 'undo',
      icon: ICONS.undo,
      tooltip: { text: '撤销', shortcuts: ['mod', 'z'] },
    },
    {
      kind: 'redo',
      icon: ICONS.redo,
      tooltip: { text: '重做', shortcuts: ['mod', 'shift', 'z'] },
    },
  ],
  // 2. 块类型
  [
    {
      icon: ICONS.heading,
      trailingIcon: ICONS.chevronDown,
      tooltip: { text: '标题' },
      items: [
        {
          kind: 'heading',
          level: 1,
          icon: ICONS.heading1,
          label: '标题 1',
          tooltip: { text: '标题 1', shortcuts: ['mod', 'alt', '1'] },
        },
        {
          kind: 'heading',
          level: 2,
          icon: ICONS.heading2,
          label: '标题 2',
          tooltip: { text: '标题 2', shortcuts: ['mod', 'alt', '2'] },
        },
        {
          kind: 'heading',
          level: 3,
          icon: ICONS.heading3,
          label: '标题 3',
          tooltip: { text: '标题 3', shortcuts: ['mod', 'alt', '3'] },
        },
        {
          kind: 'heading',
          level: 4,
          icon: ICONS.heading4,
          label: '标题 4',
          tooltip: { text: '标题 4', shortcuts: ['mod', 'alt', '4'] },
        },
      ],
    },
    {
      icon: ICONS.list,
      trailingIcon: ICONS.chevronDown,
      tooltip: { text: '列表' },
      items: [
        {
          kind: 'bulletList',
          icon: ICONS.bulletList,
          label: '无序列表',
          tooltip: { text: '无序列表', shortcuts: ['mod', 'shift', '8'] },
        },
        {
          kind: 'orderedList',
          icon: ICONS.orderedList,
          label: '有序列表',
          tooltip: { text: '有序列表', shortcuts: ['mod', 'shift', '7'] },
        },
        {
          kind: 'taskList',
          icon: ICONS.taskList,
          label: '任务列表',
          tooltip: { text: '任务列表', shortcuts: ['mod', 'shift', '9'] },
        },
      ],
    },
    {
      kind: 'blockquote',
      icon: ICONS.quote,
      tooltip: { text: '引用', shortcuts: ['mod', 'shift', 'b'] },
    },
    {
      kind: 'codeBlock',
      icon: ICONS.codeBlock,
      tooltip: { text: '代码块', shortcuts: ['mod', 'alt', 'c'] },
    },
    {
      kind: 'horizontalRule',
      icon: ICONS.minus,
      tooltip: { text: '分割线' },
    },
  ],
  // 3. 文本格式（1:1 复刻 ui-4：使用 kind: 'mark' + mark 字段）
  [
    {
      kind: 'mark',
      mark: 'bold',
      icon: ICONS.bold,
      tooltip: { text: '加粗', shortcuts: ['mod', 'b'] },
    },
    {
      kind: 'mark',
      mark: 'italic',
      icon: ICONS.italic,
      tooltip: { text: '斜体', shortcuts: ['mod', 'i'] },
    },
    {
      kind: 'mark',
      mark: 'underline',
      icon: ICONS.underline,
      tooltip: { text: '下划线', shortcuts: ['mod', 'u'] },
    },
    {
      kind: 'mark',
      mark: 'strike',
      icon: ICONS.strike,
      tooltip: { text: '删除线', shortcuts: ['mod', 'shift', 'x'] },
    },
    {
      kind: 'mark',
      mark: 'code',
      icon: ICONS.code,
      tooltip: { text: '行内代码', shortcuts: ['mod', 'e'] },
    },
  ],
  // 4. 链接 / 图片 / 表格
  [
    {
      kind: 'link',
      icon: ICONS.link,
      tooltip: { text: '链接', shortcuts: ['mod', 'k'] },
    },
    {
      kind: 'image',
      icon: ICONS.image,
      tooltip: { text: '图片' },
    },
    {
      icon: ICONS.table,
      trailingIcon: ICONS.chevronDown,
      tooltip: { text: '表格' },
      items: [
        { kind: 'insertTable', label: '插入表格', icon: ICONS.table },
        { type: 'separator' },
        { kind: 'addColumnBefore', label: '左侧插入列', icon: ICONS.columnBefore },
        { kind: 'addColumnAfter', label: '右侧插入列', icon: ICONS.columnAfter },
        { kind: 'deleteColumn', label: '删除列', icon: ICONS.columnDelete },
        { type: 'separator' },
        { kind: 'addRowBefore', label: '上方插入行', icon: ICONS.rowBefore },
        { kind: 'addRowAfter', label: '下方插入行', icon: ICONS.rowAfter },
        { kind: 'deleteRow', label: '删除行', icon: ICONS.rowDelete },
        { type: 'separator' },
        { kind: 'mergeCells', label: '合并单元格', icon: ICONS.merge },
        { kind: 'splitCell', label: '拆分单元格', icon: ICONS.split },
        { type: 'separator' },
        { kind: 'toggleHeaderRow', label: '切换表头行', icon: ICONS.tableHeader },
        { kind: 'toggleHeaderColumn', label: '切换表头列', icon: ICONS.tableHeaderColumn },
        { kind: 'toggleHeaderCell', label: '切换表头单元格', icon: ICONS.tableHeaderCell },
      ],
    },
  ],
  // 5. 文本对齐
  [
    {
      icon: ICONS.alignJustify,
      trailingIcon: ICONS.chevronDown,
      tooltip: { text: '对齐方式' },
      items: [
        {
          kind: 'textAlign',
          align: 'left',
          icon: ICONS.alignLeft,
          label: '左对齐',
        },
        {
          kind: 'textAlign',
          align: 'center',
          icon: ICONS.alignCenter,
          label: '居中',
        },
        {
          kind: 'textAlign',
          align: 'right',
          icon: ICONS.alignRight,
          label: '右对齐',
        },
        {
          kind: 'textAlign',
          align: 'justify',
          icon: ICONS.alignJustify,
          label: '两端对齐',
        },
      ],
    },
  ],
  // 6. 文本颜色 / 高亮
  [
    {
      icon: ICONS.palette,
      trailingIcon: ICONS.chevronDown,
      tooltip: { text: '文字颜色' },
      items: [
        { kind: 'textColor', color: '#ef4444', label: '红色' },
        { kind: 'textColor', color: '#f97316', label: '橙色' },
        { kind: 'textColor', color: '#eab308', label: '黄色' },
        { kind: 'textColor', color: '#22c55e', label: '绿色' },
        { kind: 'textColor', color: '#3b82f6', label: '蓝色' },
        { kind: 'textColor', color: '#8b5cf6', label: '紫色' },
        { type: 'separator' },
        { kind: 'textColor', color: '', label: '清除颜色' },
      ],
    },
    {
      icon: ICONS.highlighter,
      trailingIcon: ICONS.chevronDown,
      tooltip: { text: '高亮' },
      items: [
        { kind: 'highlight', color: '#fef08a', label: '黄色高亮' },
        { kind: 'highlight', color: '#bbf7d0', label: '绿色高亮' },
        { kind: 'highlight', color: '#bfdbfe', label: '蓝色高亮' },
        { kind: 'highlight', color: '#fecaca', label: '红色高亮' },
        { type: 'separator' },
        { kind: 'highlight', color: '', label: '清除高亮' },
      ],
    },
  ],
  // 7. 清除格式
  [
    {
      kind: 'clearFormatting',
      icon: ICONS.removeFormatting,
      tooltip: { text: '清除格式' },
    },
  ],
] as unknown as EditorToolbarItem[][];

/**
 * 紧凑工具栏配置，1:1 复刻 ui-4 官网 Editor 主示例的 fixedToolbarItems。
 *
 * 共 5 组、约 14 个按钮：
 *   1. 历史操作（撤销 / 重做）
 *   2. 块类型（标题下拉 / 列表下拉 / 引用 / 代码块）
 *   3. 文本格式（加粗 / 斜体 / 下划线 / 删除线 / 行内代码）
 *   4. 链接(slot) / 图片
 *   5. 文本对齐
 *
 * 其中链接项使用 `slot: 'link'`，需配合 `<template #link>` 使用 EditorLinkPopover。
 */
export const compactToolbarItems = [
  [
    { kind: 'undo', icon: ICONS.undo, tooltip: { text: '撤销', shortcuts: ['mod', 'z'] } },
    { kind: 'redo', icon: ICONS.redo, tooltip: { text: '重做', shortcuts: ['mod', 'shift', 'z'] } },
  ],
  [
    {
      icon: ICONS.heading,
      trailingIcon: ICONS.chevronDown,
      tooltip: { text: '标题' },
      items: [
        { kind: 'heading', level: 1, icon: ICONS.heading1, label: '标题 1' },
        { kind: 'heading', level: 2, icon: ICONS.heading2, label: '标题 2' },
        { kind: 'heading', level: 3, icon: ICONS.heading3, label: '标题 3' },
        { kind: 'heading', level: 4, icon: ICONS.heading4, label: '标题 4' },
      ],
    },
    {
      icon: ICONS.list,
      trailingIcon: ICONS.chevronDown,
      tooltip: { text: '列表' },
      items: [
        { kind: 'bulletList', icon: ICONS.bulletList, label: '无序列表' },
        { kind: 'orderedList', icon: ICONS.orderedList, label: '有序列表' },
      ],
    },
    { kind: 'blockquote', icon: ICONS.quote, tooltip: { text: '引用' } },
    { kind: 'codeBlock', icon: ICONS.codeBlock, tooltip: { text: '代码块' } },
  ],
  [
    {
      kind: 'mark',
      mark: 'bold',
      icon: ICONS.bold,
      tooltip: { text: '加粗', shortcuts: ['mod', 'b'] },
    },
    {
      kind: 'mark',
      mark: 'italic',
      icon: ICONS.italic,
      tooltip: { text: '斜体', shortcuts: ['mod', 'i'] },
    },
    {
      kind: 'mark',
      mark: 'underline',
      icon: ICONS.underline,
      tooltip: { text: '下划线', shortcuts: ['mod', 'u'] },
    },
    {
      kind: 'mark',
      mark: 'strike',
      icon: ICONS.strike,
      tooltip: { text: '删除线', shortcuts: ['mod', 'shift', 'x'] },
    },
    {
      kind: 'mark',
      mark: 'code',
      icon: ICONS.code,
      tooltip: { text: '行内代码', shortcuts: ['mod', 'e'] },
    },
  ],
  [
    { kind: 'link', icon: ICONS.link, tooltip: { text: '链接', shortcuts: ['mod', 'k'] } },
    { kind: 'image', icon: ICONS.image, tooltip: { text: '图片' } },
  ],
  [
    {
      icon: ICONS.alignJustify,
      trailingIcon: ICONS.chevronDown,
      tooltip: { text: '对齐方式' },
      items: [
        { kind: 'textAlign', align: 'left', icon: ICONS.alignLeft, label: '左对齐' },
        { kind: 'textAlign', align: 'center', icon: ICONS.alignCenter, label: '居中' },
        { kind: 'textAlign', align: 'right', icon: ICONS.alignRight, label: '右对齐' },
        { kind: 'textAlign', align: 'justify', icon: ICONS.alignJustify, label: '两端对齐' },
      ],
    },
  ],
] as unknown as EditorToolbarItem[][];

export { ICONS };
