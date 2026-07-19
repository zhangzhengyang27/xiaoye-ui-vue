/// <reference types="vue/jsx" />
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type Vditor from 'vditor';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import markdownEditorProps from './markdownEditorTypes';

// SSR 安全：仅浏览器端可访问 document/window
const isClient = typeof window !== 'undefined' && !!window.document;

// lute.min.js 本地路径：Vditor 默认从 unpkg CDN 加载 lute（Markdown 解析器），
// 国内访问不稳定会导致 SV（分屏预览）模式下预览区空白（lute.Md2HTML 调用失败）。
// 通过 Vite 的 ?url 后缀获取本地 lute.min.js 的 URL，再经 _lutePath 选项传给 Vditor。
// @ts-ignore - vditor 资源模块无类型声明
// eslint-disable-next-line import/no-unresolved
import luteUrl from 'vditor/dist/js/lute/lute.min.js?url';

// i18n 本地加载映射：避免从 unpkg CDN 加载（国内访问不稳定会导致初始化失败）
const i18nLoaders: Record<string, () => Promise<any>> = {
  zh_CN: () => import('vditor/dist/js/i18n/zh_CN.js'),
  en_US: () => import('vditor/dist/js/i18n/en_US.js'),
  ja_JP: () => import('vditor/dist/js/i18n/ja_JP.js'),
  ko_KR: () => import('vditor/dist/js/i18n/ko_KR.js'),
  zh_TW: () => import('vditor/dist/js/i18n/zh_TW.js'),
  de_DE: () => import('vditor/dist/js/i18n/de_DE.js'),
  es_ES: () => import('vditor/dist/js/i18n/es_ES.js'),
  fr_FR: () => import('vditor/dist/js/i18n/fr_FR.js'),
  pt_BR: () => import('vditor/dist/js/i18n/pt_BR.js'),
  ru_RU: () => import('vditor/dist/js/i18n/ru_RU.js'),
  sv_SE: () => import('vditor/dist/js/i18n/sv_SE.js'),
  vi_VN: () => import('vditor/dist/js/i18n/vi_VN.js'),
};

export default defineComponent({
  name: 'XYMarkdownEditor',
  inheritAttrs: false,
  __XY_MARKDOWN_EDITOR: true,
  props: initDefaultProps(markdownEditorProps(), {}),
  emits: [
    'update:modelValue',
    'input',
    'focus',
    'blur',
    'keydown',
    'esc',
    'ctrlEnter',
    'select',
    'unSelect',
    'after',
  ],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('markdown-editor', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const containerRef = ref<HTMLElement | null>(null);
    let vditorInstance: Vditor | null = null;

    // 内部值（用于非受控初始化）
    const innerValue = ref<string>(
      props.defaultValue !== undefined ? props.defaultValue : (props.modelValue ?? ''),
    );

    // 标记是否正在通过外部 modelValue 同步到 Vditor，避免回环
    let isSyncingFromProps = false;

    const rootClasses = computed(() => {
      return [prefixCls.value, hashId.value];
    });

    const rootStyles = computed(() => {
      return props.editorStyle || undefined;
    });

    // 根据 valueFormat 决定从 Vditor 取出哪种值
    const getEmitValue = (): string => {
      if (!vditorInstance) return innerValue.value;
      if (props.valueFormat === 'html') {
        return vditorInstance.getHTML();
      }
      return vditorInstance.getValue();
    };

    // 同步外部值到 Vditor（避免回环）
    const syncValueToVditor = (value: string) => {
      if (!vditorInstance) return;
      const current =
        props.valueFormat === 'html' ? vditorInstance.getHTML() : vditorInstance.getValue();
      if (value !== current) {
        isSyncingFromProps = true;
        vditorInstance.setValue(value ?? '', true);
        isSyncingFromProps = false;
      }
    };

    // 构建 Vditor options
    // i18nObj: 通过本地 import 加载的翻译对象，传给 Vditor 的 options.i18n，
    //          避免 Vditor 从 CDN 加载 i18n 文件（国内 unpkg 访问不稳定会 404）
    const buildVditorOptions = (i18nObj?: Record<string, string>): IOptions => {
      // 基础字段（字符串/数字/布尔）：undefined 不会影响 Vditor 默认值合并
      const options: IOptions = {
        value: innerValue.value,
        mode: props.mode,
        placeholder: props.placeholder,
        height: props.height,
        minHeight: props.minHeight,
        width: props.width,
        lang: props.lang as any,
        theme: props.theme,
        icon: props.icon,
        debugger: props.debug,
        typewriterMode: props.typewriterMode,
        // 指定本地 lute.min.js 路径，避免从 unpkg CDN 加载
        // 原因：国内 unpkg 访问不稳定会导致 lute 加载失败，
        // 进而使 SV（分屏预览）模式下 lute.Md2HTML 调用失败，预览区空白
        _lutePath: luteUrl,
      };

      // 通过 options.i18n 传入本地加载的翻译对象，阻止 Vditor 从 CDN 加载 i18n
      if (i18nObj) {
        (options as any).i18n = i18nObj;
      }

      // 对象类型字段：仅在 props 有值时透传
      // 原因：Vditor 的 merge 函数对 undefined 不做保护，会直接覆盖默认值，
      // 导致 mergedOptions.hint.extend 等访问报 TypeError
      if (props.cache) options.cache = props.cache;
      if (props.counter) options.counter = props.counter;
      if (props.upload) options.upload = props.upload;
      if (props.hint) options.hint = props.hint;
      if (props.preview) options.preview = props.preview;
      if (props.outline) options.outline = props.outline;
      if (props.resize) options.resize = props.resize;
      if (props.comment) options.comment = props.comment;
      if (props.toolbarConfig) options.toolbarConfig = props.toolbarConfig;
      if (props.customRenders) options.customRenders = props.customRenders;
      if (props.toolbar) options.toolbar = props.toolbar;
      if (props.cdn) options.cdn = props.cdn;
      if (props.tab) options.tab = props.tab;

      // 事件回调
      options.input = (value: string) => {
        if (isSyncingFromProps) return;
        innerValue.value = value;
        emit('input', value);
        emit('update:modelValue', getEmitValue());
      };
      options.focus = (value: string) => emit('focus', value);
      options.blur = (value: string) => emit('blur', value);
      options.keydown = (event: KeyboardEvent) => emit('keydown', event);
      options.esc = (value: string) => emit('esc', value);
      options.ctrlEnter = (value: string) => emit('ctrlEnter', value);
      options.select = (value: string) => emit('select', value);
      options.unSelect = () => emit('unSelect');
      options.after = () => {
        if (props.readonly && vditorInstance) {
          vditorInstance.disabled();
        }
        emit('after', vditorInstance);
      };

      // 透传完整 options（覆盖优先级最高）
      if (props.options) {
        Object.assign(options, props.options);
      }

      // 缓存配置：当传入 HTMLElement 时 Vditor 要求 cache.id 或 cache.enable=false
      if (!options.cache) {
        options.cache = { enable: false };
      }

      return options;
    };

    // 监听 modelValue 变化（受控模式）
    watch(
      () => props.modelValue,
      newValue => {
        if (newValue === undefined || !vditorInstance) return;
        if (isSyncingFromProps) return;
        syncValueToVditor(newValue);
      },
    );

    // 监听 readonly 变化
    watch(
      () => props.readonly,
      newValue => {
        if (!vditorInstance) return;
        if (newValue) {
          vditorInstance.disabled();
        } else {
          vditorInstance.enable();
        }
      },
    );

    // 加载 i18n 文件：从本地 import 而非 CDN，避免网络问题导致初始化失败
    // 返回翻译对象，用于通过 options.i18n 传入 Vditor（Vditor 源码检查 options.i18n，
    // 若不存在则从 CDN 加载 i18n 文件，国内 unpkg 访问不稳定会导致 404 初始化失败）
    const loadI18n = async (): Promise<Record<string, string> | undefined> => {
      const lang = props.lang;
      if (!lang || !i18nLoaders[lang]) return undefined;
      try {
        // i18n 文件内容为 `window.VditorI18n = { ... }`
        // 先清除旧值，确保读取的是新加载的内容
        (window as any).VditorI18n = undefined;
        await i18nLoaders[lang]();
        const i18nObj = (window as any).VditorI18n as Record<string, string> | undefined;
        return i18nObj;
      } catch (e) {
        // 本地加载失败时返回 undefined，让 Vditor 回退到默认行为
        console.warn(`[xy-markdown-editor] 加载 i18n ${lang} 失败:`, e);
        return undefined;
      }
    };

    onMounted(() => {
      if (!isClient || !containerRef.value) return;

      // 动态加载 CSS（SSR 安全，失败时忽略）
      // @ts-ignore - vditor CSS 模块无类型声明
      import('vditor/dist/index.css').catch(() => {});

      // 动态加载 Vditor 并初始化
      // 先加载 i18n，再将翻译对象通过 options.i18n 传入 Vditor
      Promise.all([loadI18n(), import('vditor')])
        .then(([i18nObj, module]) => {
          if (!containerRef.value) return;
          const VditorConstructor = (module as any).default || module;
          vditorInstance = new VditorConstructor(containerRef.value, buildVditorOptions(i18nObj));
        })
        .catch(error => {
          console.error('[xy-markdown-editor] 加载 Vditor 失败：', error);
        });
    });

    onBeforeUnmount(() => {
      if (vditorInstance) {
        try {
          vditorInstance.destroy();
        } catch (e) {
          console.error('[xy-markdown-editor] 销毁 Vditor 实例失败：', e);
        }
        vditorInstance = null;
      }
    });

    // 暴露 Vditor 实例及常用方法
    expose({
      /** 获取 Vditor 原始实例 */
      getVditor: () => vditorInstance,
      /** 获取 Markdown 源码 */
      getValue: () => vditorInstance?.getValue() ?? '',
      /** 获取渲染后的 HTML */
      getHTML: () => vditorInstance?.getHTML() ?? '',
      /** 设置 Markdown 内容 */
      setValue: (value: string, clearStack?: boolean) =>
        vditorInstance?.setValue(value, clearStack),
      /** 在焦点处插入内容 */
      insertValue: (value: string, render?: boolean) => vditorInstance?.insertValue(value, render),
      /** 在焦点处插入 Markdown */
      insertMD: (md: string) => vditorInstance?.insertMD(md),
      /** 禁用编辑器 */
      disabled: () => vditorInstance?.disabled(),
      /** 启用编辑器 */
      enable: () => vditorInstance?.enable(),
      /** 设置主题 */
      setTheme: (
        theme: 'dark' | 'classic',
        contentTheme?: string,
        codeTheme?: string,
        contentThemePath?: string,
      ) => vditorInstance?.setTheme(theme, contentTheme, codeTheme, contentThemePath),
      /** 切换编辑模式 */
      setMode: (mode: 'ir' | 'wysiwyg' | 'sv') => {
        // Vditor 没有公开 setMode，通过 setPreviewMode 不行；这里通过实例内部方法切换
        const inst = vditorInstance as any;
        if (inst?.vditor?.options) {
          inst.vditor.options.mode = mode;
          // 重新触发模式切换
          if (typeof inst.changeMode === 'function') {
            inst.changeMode(mode, true);
          }
        }
      },
      /** 聚焦 */
      focus: () => vditorInstance?.focus(),
      /** 失焦 */
      blur: () => vditorInstance?.blur(),
      /** 获取选中文本 */
      getSelection: () => vditorInstance?.getSelection() ?? '',
      /** 清空 undo/redo 栈 */
      clearStack: () => vditorInstance?.clearStack(),
      /** 提示消息 */
      tip: (text: string, time?: number) => vditorInstance?.tip(text, time),
      /** HTML 转 Markdown */
      html2md: (value: string) => vditorInstance?.html2md(value) ?? '',
    });

    return () => {
      return wrapSSR(<div class={rootClasses.value} style={rootStyles.value} ref={containerRef} />);
    };
  },
});
