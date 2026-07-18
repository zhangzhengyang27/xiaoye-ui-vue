import type { ExtractPropTypes, PropType } from 'vue';
import type {
  IOptions,
  IMenuItem,
  IToolbarConfig,
  IHint,
  IPreview,
  IUpload,
  IOutline,
  IResize,
  IComment,
} from 'vditor';
import { booleanType, stringType, objectType, anyType, arrayType } from '../_util/type';

/** v-model 绑定值的格式 */
export type MarkdownEditorValueFormat = 'markdown' | 'html';

/** 编辑模式 */
export type MarkdownEditorMode = 'ir' | 'wysiwyg' | 'sv';

/** 编辑器主题 */
export type MarkdownEditorTheme = 'classic' | 'dark';

/** 图标风格 */
export type MarkdownEditorIcon = 'ant' | 'material';

/** 输入事件载荷 */
export interface MarkdownEditorInputEvent {
  /** 当前 Markdown 源码 */
  value: string;
  /** Vditor 实例 */
  instance: any;
}

/** after 回调载荷 */
export interface MarkdownEditorAfterEvent {
  /** Vditor 实例 */
  instance: any;
}

export const markdownEditorProps = () => ({
  prefixCls: String,
  /** v-model 绑定值，格式由 valueFormat 决定 */
  modelValue: { type: String, default: undefined },
  /** 非受控模式下的默认值 */
  defaultValue: { type: String, default: undefined },
  /** v-model 绑定值格式：'markdown' 返回 Markdown 源码，'html' 返回渲染后的 HTML */
  valueFormat: stringType<MarkdownEditorValueFormat>('markdown'),
  /** 编辑模式：ir（即时渲染）、wysiwyg（所见即所得）、sv（分屏预览） */
  mode: stringType<MarkdownEditorMode>('ir'),
  /** 占位文本 */
  placeholder: stringType(''),
  /** 编辑器总高度，支持数字（px）或字符串（如 '300px'、'auto'） */
  height: { type: [Number, String] as PropType<number | string>, default: 'auto' },
  /** 编辑区域最小高度（px） */
  minHeight: { type: Number, default: undefined },
  /** 编辑器总宽度，支持数字（px）或字符串（如 '100%'、'auto'） */
  width: { type: [Number, String] as PropType<number | string>, default: 'auto' },
  /** 语言 */
  lang: stringType('zh_CN'),
  /** 编辑器主题 */
  theme: stringType<MarkdownEditorTheme>('classic'),
  /** 图标风格 */
  icon: stringType<MarkdownEditorIcon>('ant'),
  /** 是否只读 */
  readonly: booleanType(false),
  /** 是否启用打字机模式 */
  typewriterMode: booleanType(false),
  /** 是否显示日志 */
  debug: booleanType(false),
  /** CDN 地址，留空使用 Vditor 内置默认（unpkg） */
  cdn: stringType(''),
  /** tab 键操作字符串 */
  tab: stringType(''),
  /** 工具栏配置，元素为 string（内置按钮 name）或 IMenuItem（自定义按钮） */
  toolbar: arrayType<Array<string | IMenuItem>>(undefined),
  /** 工具栏显示配置 */
  toolbarConfig: objectType<IToolbarConfig>(undefined),
  /** 缓存配置 */
  cache: objectType<any>(undefined),
  /** 计数器配置 */
  counter: objectType<any>(undefined),
  /** 上传配置 */
  upload: objectType<IUpload>(undefined),
  /** 提示配置 */
  hint: objectType<IHint>(undefined),
  /** 预览配置 */
  preview: objectType<IPreview>(undefined),
  /** 大纲配置 */
  outline: objectType<IOutline>(undefined),
  /** resize 配置 */
  resize: objectType<IResize>(undefined),
  /** 评论配置 */
  comment: objectType<IComment>(undefined),
  /** 自定义渲染器 */
  customRenders:
    arrayType<Array<{ language: string; render: (element: HTMLElement, vditor: any) => void }>>(
      undefined,
    ),
  /** 透传 Vditor 完整 options，会与以上 props 合并（覆盖优先级最高） */
  options: objectType<Partial<IOptions>>(undefined),
  /** 容器样式 */
  editorStyle: anyType<any>(null),
});

export type MarkdownEditorProps = Partial<ExtractPropTypes<ReturnType<typeof markdownEditorProps>>>;

export default markdownEditorProps;
