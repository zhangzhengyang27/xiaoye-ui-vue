import type { MetaType } from '../shared.ts';
import { toMeta } from '../shared.ts';

export const form: MetaType[] = toMeta([
  'AutoComplete',
  'Cascader',
  'Checkbox',
  'ColorPicker',
  'DatePicker',
  { name: 'Dropdown', from: 'xiaoye-ui/dropdown', sideEffects: false },
  'RangePicker',
  'Fluid',
  'IconField',
  'InputChips',
  'InputGroup',
  'InputGroupAddon',
  'InputIcon',
  'InputNumber',
  'CircularSlider',
  'Radio',
  { name: 'RadioGroup', from: 'xiaoye-ui/radio/Group', sideEffects: 'xiaoye-ui/radio/style' },
  'Select',
  'Slider',
  'Switch',
  'ToggleButton',
  'TreeSelect',
]);

export const button: MetaType[] = toMeta(['Button', 'SplitButton']);

export const data: MetaType[] = toMeta([
  'Column',
  'Row',
  'ColumnGroup',
  'DataTable',
  'DataView',
  'Table',
  'SortableList',
  'TreeChart',
  'Pagination',
  'TransferSortable',
  'Tree',
  'TreeTable',
  'Timeline',
  'VirtualList',
]);

export const panel: MetaType[] = toMeta([
  'Card',
  'LazyContent',
  'Divider',
  'Fieldset',
  'Panel',
  'ScrollPanel',
  'Splitter',
  'SplitterPanel',
  'Tabs',
  'TabList',
  'Tab',
  'TabPanels',
  'TabPanel',
  'Toolbar',
]);

export const overlay: MetaType[] = toMeta([
  { name: 'ConfirmDialog', use: { as: 'ConfirmationService' } },
  { name: 'Popconfirm', use: { as: 'ConfirmationService' } },
  'Drawer',
  { name: 'DynamicDialog', use: { as: 'DialogService' } },
  'Modal',
  'Popover',
]);

export const file: MetaType[] = toMeta(['Upload']);

export const menu: MetaType[] = toMeta([
  'Breadcrumb',
  'ContextMenu',
  'Dock',
  'Menu',
  'MegaMenu',
  'Menubar',
  'PanelMenu',
  'Steps',
  'TabMenu',
  'TieredMenu',
]);

export const chart: MetaType[] = toMeta(['Chart']);

export const messages: MetaType[] = toMeta(['Message', 'Notification']);

export const media: MetaType[] = toMeta(['Carousel', 'Galleria', 'Image', 'ImageCompare']);

export const misc: MetaType[] = toMeta([
  'ConfigProvider',
  'Avatar',
  'AvatarGroup',
  'Badge',
  'BlockUI',
  'InlineEdit',
  'MeterGroup',
  'OverlayBadge',
  'Skeleton',
  'Progress',
  { name: 'ProgressBar', from: 'xiaoye-ui/progress' },
  'Tag',
  'Terminal',
]);

export const extensions: MetaType[] = toMeta([
  { name: 'Form', from: 'xiaoye-ui/form' },
  'RichTextEditor',
  'RichTextEditorToolbar',
  'RichTextEditorDragHandle',
  'RichTextEditorEmojiMenu',
  'RichTextEditorMentionMenu',
  'RichTextEditorSuggestionMenu',
  'NuxtEditor',
  'NuxtEditorToolbar',
  'NuxtEditorDragHandle',
  'NuxtEditorEmojiMenu',
  'NuxtEditorMentionMenu',
  'NuxtEditorSuggestionMenu',
]);

export const antd: MetaType[] = toMeta([
  'Alert',
  'Anchor',
  'AnchorLink',
  'BackTop',
  'BadgeRibbon',
  'CardGrid',
  'CardMeta',
  'Col',
  'Collapse',
  'CollapseItem',
  'Comment',
  'Descriptions',
  'DescriptionsItem',
  'DirectoryTree',
  'Empty',
  'Flex',
  'FloatButton',
  'FloatButtonGroup',
  'FormItem',
  'FormList',
  'ImagePreviewGroup',
  'Input',
  'Layout',
  'LayoutContent',
  'LayoutFooter',
  'LayoutHeader',
  'LayoutSider',
  'List',
  'ListItem',
  'ListItemMeta',
  'Mentions',
  'PageHeader',
  'QRCode',
  'Rate',
  'Result',
  'Segmented',
  'Space',
  'SpaceCompact',
  'Spin',
  'Statistic',
  'Tour',
  'Transfer',
  'Typography',
  {
    name: 'TypographyLink',
    from: 'xiaoye-ui/typography/Link',
    sideEffects: 'xiaoye-ui/typography/style/link',
  },
  {
    name: 'TypographyParagraph',
    from: 'xiaoye-ui/typography/Paragraph',
    sideEffects: 'xiaoye-ui/typography/style/paragraph',
  },
  {
    name: 'TypographyText',
    from: 'xiaoye-ui/typography/Text',
    sideEffects: 'xiaoye-ui/typography/style/text',
  },
  {
    name: 'TypographyTitle',
    from: 'xiaoye-ui/typography/Title',
    sideEffects: 'xiaoye-ui/typography/style/title',
  },
  'UploadDragger',
  'Watermark',
]);

// All XiaoyeUI Components
export const components: MetaType[] = [
  ...form,
  ...button,
  ...data,
  ...panel,
  ...overlay,
  ...file,
  ...menu,
  ...chart,
  ...messages,
  ...media,
  ...misc,
  ...extensions,
  ...antd,
];
