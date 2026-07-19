import type { CSSObject } from '../../_util/cssinjs';
import { Keyframes } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {
  /** 编辑器内容区内边距（默认 32，对应 p-8） */
  contentPadding?: number;
  /** 编辑器内容区水平内边距（sm 及以上，默认 32，对应 ui-4 sm:px-8） */
  contentPaddingInline?: number;
  /** 编辑器内容区垂直内边距（默认 54，对应 py-13.5） */
  contentPaddingBlock?: number;
  /** 编辑器内容区最小高度（默认 84） */
  contentMinHeight?: number;
  /** 工具栏按钮高度（默认 28，对应 ui-4 sm square 尺寸） */
  toolbarButtonHeight?: number;
  /** 工具栏按钮整体尺寸（默认 28，对应 ui-4 sm square + padding 6 + icon 16） */
  toolbarButtonSize?: number;
  /** 工具栏组间间距（默认 6） */
  toolbarButtonGap?: number;
  /** 工具栏组内按钮间距（默认 2） */
  toolbarGroupGap?: number;
  /** 菜单最小宽度（默认 192） */
  menuMinWidth?: number;
  /** 菜单最大宽度（默认 240） */
  menuMaxWidth?: number;
  /** 菜单最大高度（默认 384） */
  menuMaxHeight?: number;
  /** 链接 popover 最小宽度（默认 320） */
  linkPopoverMinWidth?: number;
}

// 合并 RichTextEditor 主组件 + 5 个子组件（Toolbar/DragHandle/MentionMenu/EmojiMenu/SuggestionMenu）
// 的样式到一个 hook 中。
// 修复 bug：源项目子组件仅 `import './style'` 未调用 useStyle，
// 导致 `genComponentStyleHook` 返回的函数未执行，子组件样式不会注册。
// 这里通过主组件 useStyle 一次性注册所有样式，子组件样式使用绝对类名选择器。
//
// 样式按 ui-4（Nuxt UI v4）精确数值实现，使用 ant Design Token 替换 ui-4 的 CSS 变量：
//   --ui-bg              -> colorBgContainer
//   --ui-bg-muted        -> colorBgLayout
//   --ui-bg-elevated     -> colorBgLayout
//   --ui-bg-accented     -> colorFillSecondary
//   --ui-text            -> colorText
//   --ui-text-muted      -> colorTextSecondary
//   --ui-text-dimmed     -> colorTextQuaternary
//   --ui-text-highlighted-> colorText
//   --ui-text-inverted   -> colorTextLightSolid
//   --ui-border          -> colorBorderSecondary
//   --ui-border-muted    -> colorBorderSecondary
//   --ui-border-accented -> colorBorder
//   --ui-color-primary   -> colorPrimary
//   shadow-sm            -> 0 1px 2px 0 rgba(0,0,0,0.05)
//   shadow-lg            -> boxShadowTertiary

// 菜单打开/关闭动画 keyframes（使用 cssinjs Keyframes 避免 hashed animation 警告）
const xyEditorMenuScaleIn = new Keyframes('xy-editor-menu-scale-in', {
  from: { opacity: '0', transform: 'scale(0.95)' },
  to: { opacity: '1', transform: 'scale(1)' },
});

const xyEditorMenuScaleOut = new Keyframes('xy-editor-menu-scale-out', {
  from: { opacity: '1', transform: 'scale(1)' },
  to: { opacity: '0', transform: 'scale(0.95)' },
});

export default genComponentStyleHook(
  'RichTextEditor',
  token => {
    const {
      componentCls,
      colorBgContainer,
      colorBorder,
      colorBorderSecondary,
      borderRadius,
      borderRadiusLG,
      colorTextSecondary,
      colorText,
      colorBgLayout,
      colorFillTertiary,
      colorFillSecondary,
      boxShadowTertiary,
      paddingMD,
      paddingXS,
      paddingSM,
      colorPrimary,
      colorTextLightSolid,
      // 尺寸/间距 token
      paddingXXS,
      marginXXS,
      marginXS,
      // 字号 token
      fontSizeSM,
      fontSizeLG,
      fontSizeXL,
      // 控件高度 token
      controlHeight,
      controlHeightSM,
      // ComponentToken
      contentPadding,
      contentPaddingInline,
      contentPaddingBlock,
      contentMinHeight,
      toolbarButtonSize,
      toolbarButtonGap,
      toolbarGroupGap,
      menuMinWidth,
      menuMaxWidth,
      menuMaxHeight,
      linkPopoverMinWidth,
    } = token;

    const cp = colorPrimary;
    const focusShadow = `0 0 0 2px color-mix(in srgb, ${cp} 20%, transparent)`;
    // 工具栏按钮 active 态背景：严格按 ui-4 primary/10，hover primary/15
    const activeBg = `color-mix(in srgb, ${cp} 10%, transparent)`;
    const activeBgHover = `color-mix(in srgb, ${cp} 15%, transparent)`;
    // 菜单 item hover/active 的 ::before 背景
    // ui-4 使用 bg-elevated/50 与 bg-elevated/75；Ant Design 中对应 colorFillTertiary / colorFillSecondary，
    // 比 colorBgLayout 半透明显眼，键盘/鼠标高亮都能清晰识别。
    const itemHoverBg = colorFillTertiary;
    const itemActiveBg = colorFillSecondary;

    // shadow-sm：对应 ui-4 的 0 1px 2px 0 rgba(0,0,0,0.05)
    const shadowSM = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';

    // 菜单类名选择器辅助函数（4 个菜单共用样式）
    const menuSelector = (cls: string) => `.${cls}`;

    return [
      // ===================== RichTextEditor 主组件 =====================
      {
        [componentCls]: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${colorBorder}`,
          borderRadius: `${borderRadius}px`,
          background: colorBgContainer,
          overflow: 'hidden',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',

          '&:focus-within': {
            borderColor: cp,
            boxShadow: focusShadow,
          },

          '&:has(.ProseMirror[contenteditable="false"])': {
            opacity: 0.6,
            pointerEvents: 'none',
          },

          // content slot：EditorContent 包装层
          '&-content': {
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            minHeight: `${contentMinHeight}px`,
          },

          // base slot：直接作用在 ProseMirror 元素上（通过 editorProps.attributes.class 注入）
          // ui-4 默认：outline-none w-full *:my-5 *:first:mt-0 *:last:mb-0 sm:px-8 selection:bg-primary/20
          // 这里把 sm:px-8（32px）映射为 contentPaddingInline，小屏水平 padding 由 contentPadding 控制
          '&-base': {
            outline: 'none',
            width: '100%',
            minHeight: '100%',
            paddingBlock: `${contentPaddingBlock}px`,
            paddingInline: `${contentPadding}px`,
            color: 'inherit',
            fontSize: `${fontSizeLG}px`,
            lineHeight: 1.75,

            // sm 屏幕以上使用 contentPaddingInline（ui-4 sm:px-8 = 32px；官网示例通过 ui prop 覆盖为 sm:px-16）
            '@media (min-width: 640px)': {
              paddingInline: `${contentPaddingInline}px`,
            },

            // 子元素 margin-block: 20px；首末子元素 margin 0
            '> *': { marginBlock: '20px' },
            '> :first-child': { marginTop: 0 },
            '> :last-child': { marginBottom: 0 },

            // 文本选区背景色（参考：selection:bg-primary/20）
            '::selection': {
              background: `color-mix(in srgb, ${colorPrimary} 20%, transparent)`,
            },

            // 选中节点背景（参考：.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper]):bg-primary/20）
            '.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper])': {
              background: `color-mix(in srgb, ${colorPrimary} 20%, transparent)`,
            },

            // 段落：margin 0, line-height 28px（ui-4 leading-7）
            p: { margin: 0, lineHeight: '28px' },

            a: {
              color: cp,
              borderBottom: '1px solid transparent',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.15s ease, border-color 0.15s ease',

              '&:hover': { borderBottomColor: cp },

              code: {
                borderStyle: 'dashed',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              },

              '&:hover code': { borderColor: cp, color: cp },
            },

            '.mention': {
              color: cp,
              fontWeight: 500,
              background: 'transparent',
              padding: 0,
              borderRadius: 0,
            },

            // 标题共享样式（参考：text-highlighted + font-bold）
            'h1, h2, h3, h4, h5, h6': {
              color: colorText,
              fontWeight: 700,
              marginBlock: '20px',
              // 标题内行内 code 共享样式（参考：[&_:is(h1,h2,h3,h4,h5,h6)>code]:border-dashed font-bold）
              code: {
                borderStyle: 'dashed',
                fontWeight: 700,
              },
            },
            // 标题字号/行高（ui-4 精确值：text-3xl=30/36, text-2xl=24/32, text-xl=20/28, text-lg=18/28, text-base=16/24）
            h1: { fontSize: '30px', lineHeight: '36px' },
            h2: {
              fontSize: '24px',
              lineHeight: '32px',
              // h2 内 code 字号（参考：[&_h2>code]:text-xl/6 = 20px / 24px）
              code: { fontSize: '20px', lineHeight: '24px' },
            },
            h3: {
              fontSize: '20px',
              lineHeight: '28px',
              // h3 内 code 字号（参考：[&_h3>code]:text-lg/5 = 18px / 20px）
              code: { fontSize: '18px', lineHeight: '20px' },
            },
            h4: { fontSize: '18px', lineHeight: '28px' },
            h5: { fontSize: '16px', lineHeight: '24px' },
            h6: { fontSize: '16px', lineHeight: '24px' },

            // blockquote：左边框 4px, 用 colorBorder（ui-4 border-accented），padding-left 16px
            blockquote: {
              borderInlineStart: `4px solid ${colorBorder}`,
              paddingLeft: '16px',
              margin: '20px 0',
              fontStyle: 'italic',
              color: colorTextSecondary,
            },

            // ul/ol：padding-left 24px（ui-4 精确值，非 paddingLG）
            'ul, ol': {
              paddingInlineStart: '24px',
              margin: '20px 0',
            },
            ul: {
              listStyle: 'disc',
              // marker 颜色用 colorBorder（对应 ui-4 --ui-border-accented）
              '&::marker': { color: colorBorder },
            },
            ol: {
              listStyle: 'decimal',
              // marker 颜色用 colorTextSecondary（对应 ui-4 --ui-text-muted）
              '&::marker': { color: colorTextSecondary },
            },
            // li：margin 6px 0, padding-left 6px（ui-4 精确值）
            li: {
              marginBlock: '6px',
              paddingInlineStart: '6px',
            },

            // 行内 code：padding 2px 6px, font-size 14px, border-radius 6px（ui-4 精确值）
            code: {
              padding: '2px 6px',
              fontSize: '14px',
              fontFamily: 'monospace',
              fontWeight: 500,
              borderRadius: '6px',
              display: 'inline-block',
              border: `1px solid ${colorBorderSecondary}`,
              color: colorText,
              background: colorBgLayout,
            },

            // pre 代码块：font-size 14px, line-height 24px, border-radius 6px, padding 12px 16px（ui-4 精确值）
            pre: {
              background: colorBgLayout,
              color: colorText,
              border: `1px solid ${colorBorderSecondary}`,
              borderRadius: '6px',
              padding: '12px 16px',
              margin: '20px 0',
              fontSize: '14px',
              lineHeight: '24px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowX: 'auto',

              code: {
                background: 'transparent',
                color: 'inherit',
                padding: 0,
                fontSize: 'inherit',
                fontFamily: 'inherit',
                fontWeight: 'inherit',
                borderRadius: 0,
                border: 'none',
                display: 'inline',
              },
            },

            img: {
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '6px',
              margin: '20px 0',
              '&.ProseMirror-selectednode': {
                outline: `2px solid ${colorPrimary}`,
                outlineOffset: '2px',
              },
            },

            hr: {
              border: 'none',
              borderTop: `1px solid ${colorBorderSecondary}`,
              margin: 0,
            },
            // 水平线外层包裹间距（ui-4 精确值：my-8=32px, py-2=8px）
            '[data-type="horizontalRule"]': {
              marginBlock: '32px',
              paddingBlock: '8px',
            },

            table: {
              width: '100%',
              borderCollapse: 'collapse',
              margin: '20px 0',

              'th, td': {
                border: `1px solid ${colorBorder}`,
                padding: `${paddingXS}px ${paddingSM}px`,
                textAlign: 'left',
              },

              th: {
                background: colorBgLayout,
                fontWeight: 600,
              },
            },

            '.ProseMirror-gapcursor': {
              display: 'none',
              pointerEvents: 'none',
              position: 'relative',

              '&:after': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: '-2px',
                width: '20px',
                borderTop: `2px solid ${cp}`,
                animationName: 'ProseMirror-cursor-blink',
                animationDuration: '1.1s',
                animationTimingFunction: 'steps(2, start)',
                animationIterationCount: 'infinite',
              },
            },

            '.ProseMirror-gapcursor-first': {
              marginLeft: 0,
            },

            // placeholder：基于 ProseMirror 内置 :before 伪元素（与源项目一致）
            // Tiptap Placeholder 扩展会给空段落添加 data-placeholder 属性和 is-empty class
            '.is-empty:before, .is-editor-empty:before': {
              content: 'attr(data-placeholder)',
              float: 'left',
              color: colorTextSecondary,
              pointerEvents: 'none',
              height: 0,
              lineHeight: '28px',
            },
          },

          // firstLine 模式：仅第一个空段落显示 placeholder（同时兼容 Tiptap 默认的 is-empty 与 ui-4 的 is-editor-empty）
          '&-base--firstLine .is-empty:not(:first-child):before, &-base--firstLine .is-editor-empty:not(:first-child):before':
            {
              content: 'none',
            },

          '&-link-popover': {
            // fixed 定位：避免被 editor overflow:hidden 裁剪，并跟随光标/选区
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 100,
            background: colorBgContainer,
            border: 'none',
            borderRadius: `${borderRadiusLG}px`,
            // ring + shadow：对应 ui-4 popover 的 ring-default shadow-lg
            boxShadow: `0 0 0 1px ${colorBorderSecondary}, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`,
            minWidth: `${linkPopoverMinWidth}px`,
            padding: `${paddingMD}px`,

            '&-header': {
              display: 'flex',
              alignItems: 'center',
              gap: `${paddingXS}px`,
              marginBottom: `${paddingSM}px`,
              color: colorText,
              fontSize: `${fontSizeSM}px`,
              fontWeight: 500,
            },

            '&-header-icon': {
              color: colorTextSecondary,
              width: `${fontSizeLG}px`,
              height: `${fontSizeLG}px`,
            },

            '&-input-wrapper': {
              marginBottom: `${paddingSM}px`,
            },

            '&-input': {
              width: '100%',
              height: `${controlHeight}px`,
              padding: `0 ${paddingSM}px`,
              border: `1px solid ${colorBorder}`,
              borderRadius: `${borderRadius}px`,
              fontSize: `${fontSizeSM}px`,
              color: colorText,
              background: colorBgContainer,
              outline: 'none',

              '&:focus': {
                borderColor: cp,
                boxShadow: focusShadow,
              },
            },

            '&-button-group': {
              display: 'flex',
              justifyContent: 'flex-end',
              gap: `${paddingXS}px`,
            },

            '&-button': {
              height: `${controlHeightSM}px`,
              padding: `0 ${paddingSM}px`,
              border: 'none',
              borderRadius: `${borderRadius}px`,
              cursor: 'pointer',
              fontSize: `${fontSizeSM}px`,
              transition: 'background-color 0.15s ease',
            },

            '&-button-apply': {
              background: cp,
              color: colorTextLightSolid || '#fff',

              '&:hover': {
                background: `color-mix(in srgb, ${cp} 80%, #000)`,
              },
            },

            '&-button-cancel': {
              background: 'transparent',
              color: colorTextSecondary,
              border: `1px solid ${colorBorder}`,

              '&:hover': {
                background: colorBgLayout,
              },
            },
          },
        },

        '@keyframes ProseMirror-cursor-blink': {
          to: { visibility: 'hidden' },
        },
      } as CSSObject,

      // ===================== RichTextEditorToolbar =====================
      // ui-4 工具栏规范（严格按 editor-toolbar.ts 实现）：
      //   fixed 模式 root：无 bg/border/padding（视觉容器由外层 Editor 提供）
      //                    但 XiaoyeUI 定制：保留 bg + borderBottom + padding 让 toolbar 有视觉边界
      //   bubble/floating 模式 root：bg-default border border-default rounded-lg p-1
      //   base：flex items-stretch gap-1.5
      //   group：flex items-center gap-0.5
      //   separator：w-px self-stretch bg-border
      //   按钮（sm + square + ghost + neutral）：padding 6px, icon 16x16, 总尺寸 28x28
      //     hover: bg-elevated/50（50% 透明度，非纯色）
      //     active (soft + primary): text-primary bg-primary/10 hover:bg-primary/15
      //     focus-visible: ring-2 ring-inset ring-border-inverted/25
      //     disabled: opacity-75 cursor-not-allowed
      {
        '.xy-rich-text-editor-toolbar': {
          // base: flex items-stretch gap-1.5
          display: 'flex',
          alignItems: 'stretch',
          flexWrap: 'nowrap',
          gap: `${toolbarButtonGap}px`,
          outline: 'none',
          // 严格按 Nuxt UI 官网 fixed toolbar 示例：border-b border-muted sticky top-0
          // inset-x-0 px-8 sm:px-16 py-2 z-50 bg-default overflow-x-auto
          padding: `8px 32px`,
          background: colorBgContainer,
          // sm 屏幕以上使用 px-16（64px），与 ui-4 官网一致
          '@media (min-width: 640px)': {
            padding: `8px 64px`,
          },
          borderBottom: `1px solid ${colorBorderSecondary}`,
          // 当外层容器太窄时，允许 toolbar 水平滚动而不是换行
          overflowX: 'auto',

          // bubble/floating 模式：bg-default border border-default rounded-lg p-1
          // 严格按 ui-4: bubble/floating 才有 bg/border/rounded-lg/p-1
          '&[data-layout="bubble"], &[data-layout="floating"]': {
            position: 'absolute',
            zIndex: 10,
            padding: `${marginXXS}px`,
            borderRadius: '8px',
            border: `1px solid ${colorBorderSecondary}`,
            background: colorBgContainer,
            // 覆盖 fixed 模式的 borderBottom（避免重复边框）
            borderBottom: `1px solid ${colorBorderSecondary}`,
            boxShadow: boxShadowTertiary,
          },

          // base 层（bubble/floating 模式下使用）：flex items-stretch gap-1.5
          '&-base': {
            display: 'flex',
            alignItems: 'stretch',
            gap: `${toolbarButtonGap}px`,
          },
          // group: flex items-center gap-0.5
          '&-group': {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: `${toolbarGroupGap}px`,
          },
          // separator: w-px self-stretch bg-border（group 之间的分隔符）
          '&-group-separator': {
            width: '1px',
            alignSelf: 'stretch',
            background: colorBorderSecondary,
            flexShrink: 0,
          },
          // group 内 separator（type='separator' item）
          '&-separator': {
            width: '1px',
            alignSelf: 'stretch',
            background: colorBorderSecondary,
            flexShrink: 0,
          },
          '&-label': {
            padding: `0 ${marginXS}px`,
            fontSize: `${fontSizeSM}px`,
            fontWeight: 600,
            color: colorText,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: '24px',
            whiteSpace: 'nowrap',
          },
          // 工具栏按钮：sm + square + ghost + neutral
          //   基础：inline-flex items-center justify-center gap-1.5 font-medium rounded-md
          //   sm square：p-1.5（6px）text-xs（12px）-> 总尺寸 28x28
          //   ghost neutral：text-default hover:bg-elevated/50
          //   active soft primary：text-primary bg-primary/10 hover:bg-primary/15
          //   disabled：opacity-75 cursor-not-allowed
          //   focus-visible：ring-2 ring-inset ring-border-inverted/25
          '&-button': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            // 重置浏览器/VitePress 可能给 button 加的 margin
            margin: 0,
            // 默认按 square 尺寸：padding 6px, icon 16x16 -> 总尺寸 28x28
            // width 设为 auto：icon-only 时自然撑出 28px；含 label/trailingIcon 时随内容延展
            width: 'auto',
            height: `${toolbarButtonSize}px`,
            minWidth: `${toolbarButtonSize}px`,
            padding: '6px',
            fontSize: '12px',
            lineHeight: 1,
            fontWeight: 500,
            // 默认态：color colorText（text-default）
            color: colorText,
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease, color 0.15s ease, outline-color 0.15s ease',
            userSelect: 'none',
            outline: 'none',
            // hover：bg-elevated/50（严格对应 ui-4），使用 colorFillTertiary 提高可读性
            '&:hover:not(:disabled)': {
              background: colorFillTertiary,
              color: colorText,
            },
            // active：同 hover（ui-4 ghost 模式 active 与 hover 一致）
            '&:active:not(:disabled)': {
              background: colorFillTertiary,
            },
            // dropdown trigger 打开态：对应 ui-4 data-[state=open]:bg-elevated/50
            '&[data-state="open"]:not(:disabled)': {
              background: colorFillTertiary,
            },
            // focus-visible：outline-2 outline-inset outline-border-inverted/25
            // 对应 ui-4: focus-visible:ring-2 focus-visible:ring-inset（CSS outline 实现 inset 效果）
            '&:focus-visible': {
              outline: `2px solid color-mix(in srgb, ${colorTextLightSolid} 25%, transparent)`,
              outlineOffset: '-2px',
            },
            // 激活态（soft + primary）：text-primary bg-primary/10 hover:bg-primary/15
            '&-active': {
              color: cp,
              background: activeBg,
              '&:hover:not(:disabled)': {
                background: activeBgHover,
              },
              '&:focus-visible': {
                outline: `2px solid color-mix(in srgb, ${colorTextLightSolid} 25%, transparent)`,
                outlineOffset: '-2px',
              },
            },
            // 禁用态：opacity 0.75, cursor not-allowed
            '&-disabled': { opacity: 0.75, cursor: 'not-allowed' },
          },
          // icon 尺寸 16x16，颜色继承父元素，SVG 使用 currentColor 填充/描边
          '&-icon': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            flexShrink: 0,
            color: 'currentColor',
            'svg,img': {
              width: '100%',
              height: '100%',
              fill: 'currentColor',
              stroke: 'currentColor',
            },
          },
          '&-dropdown': { position: 'relative', display: 'inline-flex' },
          '&-dropdown-panel': {
            // 使用 fixed 定位，避免被 toolbar 的 overflow-x:auto 裁剪
            position: 'fixed',
            top: 0,
            left: 0,
            // ui-4 DropdownMenu content 默认 min-w-32 = 128px
            minWidth: '128px',
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 100,
            padding: 0,
            background: colorBgContainer,
            border: 'none',
            borderRadius: '6px',
            // ring + shadow-lg：对应 ui-4 DropdownMenu content
            // Tailwind shadow-lg ≈ 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)
            boxShadow: `0 0 0 1px ${colorBorderSecondary}, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`,
            display: 'flex',
            flexDirection: 'column',
            transformOrigin: 'top left',
            '&[data-state="open"]': {
              animationName: xyEditorMenuScaleIn,
              animationDuration: '100ms',
              animationTimingFunction: 'ease-out',
            },
            '&[data-state="closed"]': {
              animationName: xyEditorMenuScaleOut,
              animationDuration: '100ms',
              animationTimingFunction: 'ease-in',
            },
          },
          '&-dropdown-group': {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '4px',
            isolation: 'isolate',
          },
          '&-dropdown-group-separator': {
            height: '1px',
            margin: '4px -4px',
            background: colorBorderSecondary,
          },
          '&-dropdown-separator': {
            height: '1px',
            margin: '4px -4px',
            background: colorBorderSecondary,
          },
          '&-dropdown-label': {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: colorText,
            lineHeight: 1.25,
          },
          '&-dropdown-item': {
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            // ui-4 EditorToolbar 内 DropdownMenu 继承 size='sm'：p-1.5 text-xs gap-1.5
            padding: '6px',
            fontSize: '12px',
            lineHeight: '16px',
            color: colorText,
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            textAlign: 'left',
            outline: 'none',
            userSelect: 'none',
            transition: 'color 0.15s ease',
            // ::before 伪元素：对应 ui-4 item 的 hover/active 背景
            '::before': {
              content: '""',
              position: 'absolute',
              inset: '1px',
              borderRadius: '6px',
              zIndex: -1,
              transition: 'background-color 0.15s ease',
            },
            // hover / data-highlighted：bg-elevated/50
            '&:hover:not(:disabled), &[data-highlighted]:not([data-disabled])': {
              color: colorText,
              '::before': { background: itemHoverBg },
            },
            // focus-visible：outline-2 outline-inset
            '&:focus-visible': {
              outline: `2px solid color-mix(in srgb, ${colorTextLightSolid} 25%, transparent)`,
              outlineOffset: '-2px',
            },
            // active：text-highlighted before:bg-elevated
            '&-active': {
              color: colorText,
              '::before': { background: itemActiveBg },
            },
            '&-disabled': { opacity: 0.75, cursor: 'not-allowed' },
            // 图标默认色 text-dimmed，hover/active 变为 text-default
            // ui-4 sm 下拉项图标尺寸：size-4 = 16x16px
            // 使用 colorTextSecondary 保证默认态可读性，避免 colorTextQuaternary 过淡
            '& .xy-rich-text-editor-toolbar-icon': {
              width: '16px',
              height: '16px',
              color: colorTextSecondary,
              transition: 'color 0.15s ease',
            },
            '&:hover:not(:disabled) .xy-rich-text-editor-toolbar-icon, &[data-highlighted]:not([data-disabled]) .xy-rich-text-editor-toolbar-icon, &&-active .xy-rich-text-editor-toolbar-icon':
              {
                color: colorText,
              },
          },
        },
      } as CSSObject,

      // ===================== Toolbar Tooltip（必须顶层，因为组件 Teleport 到 body） =====================
      {
        '.xy-rich-text-editor-toolbar-tooltip': {
          position: 'fixed',
          zIndex: 9999,
          height: '24px',
          padding: '4px 10px',
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: 500,
          color: colorText,
          background: colorBgContainer,
          border: `1px solid ${colorBorderSecondary}`,
          borderRadius: '2px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          boxShadow: shadowSM,
          '&-top': { transform: 'translate(-50%, -100%)', marginTop: `-${marginXXS + 2}px` },
          '&-bottom': { transform: 'translate(-50%, 0)', marginTop: `${marginXXS + 2}px` },
          '&-left': { transform: 'translate(-100%, -50%)', marginLeft: `-${marginXXS + 2}px` },
          '&-right': { transform: 'translate(0, -50%)', marginLeft: `${marginXXS + 2}px` },
          '&-arrow': {
            position: 'absolute',
            width: `${paddingXXS + 2}px`,
            height: `${paddingXXS + 2}px`,
            background: colorBgContainer,
            borderRight: `1px solid ${colorBorderSecondary}`,
            borderBottom: `1px solid ${colorBorderSecondary}`,
            rotate: '45deg',
          },
          '&-top &-arrow': { bottom: '-3px', left: '50%', marginLeft: '-3px' },
          '&-bottom &-arrow': { top: '-3px', left: '50%', marginLeft: '-3px', rotate: '225deg' },
          '&-left &-arrow': { right: '-3px', top: '50%', marginTop: '-3px', rotate: '-45deg' },
          '&-right &-arrow': { left: '-3px', top: '50%', marginTop: '-3px', rotate: '135deg' },
        },

        // 动画：scale-in 100ms ease-out（对应 ui-4 tooltip/dropdown 动画）
        '.xy-dropdown-enter-active, .xy-dropdown-leave-active': {
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
        },
        '.xy-dropdown-enter-from, .xy-dropdown-leave-to': {
          opacity: 0,
          transform: 'scale(0.95)',
        },
        '.tooltip-enter-active, .tooltip-leave-active': {
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
        },
        '.tooltip-enter-from, .tooltip-leave-to': {
          opacity: 0,
          transform: 'scale(0.95)',
        },
      } as CSSObject,

      // ===================== RichTextEditorDragHandle =====================
      // ui-4 规范：
      //   display hidden sm:flex, align-items center, justify-content center, transition all 200ms ease-out
      //   handle: cursor grab, padding 0 4px（注意不是 4px，是水平 4px）
      //   DragHandle 按钮：color neutral, variant ghost, size sm
      {
        '.xy-rich-text-editor-drag-handle': {
          position: 'absolute',
          zIndex: 1,
          opacity: 0,
          transition: 'all 200ms ease-out',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&[data-state="visible"]': { opacity: 1, pointerEvents: 'auto' },
          // 响应式隐藏：参考 hidden sm:flex，<640px 不显示拖拽手柄
          '@media (max-width: 639px)': {
            display: 'none',
          },
          // handle：cursor grab, padding 0 4px
          '&-handle': {
            cursor: 'grab',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            color: colorText,
            padding: '0 4px',
            width: `${controlHeightSM}px`,
            height: `${controlHeightSM}px`,
            '&:hover': { color: colorText, background: colorFillTertiary },
            '&:active': { cursor: 'grabbing' },
          },
          // 默认拖拽按钮（不传 slot 时渲染）—— 使用 sm + ghost + neutral 样式
          '&-default': {
            cursor: 'grab',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            color: colorText,
            width: `${toolbarButtonSize}px`,
            height: `${toolbarButtonSize}px`,
            padding: '6px',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: '6px',
            outline: 'none',
            transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
            '&:hover': { color: colorText, background: colorFillTertiary },
            '&:active': { cursor: 'grabbing' },
            '&:focus-visible': {
              boxShadow: `0 0 0 3px color-mix(in srgb, ${colorTextLightSolid} 25%, transparent)`,
            },
          },
        },
      } as CSSObject,

      // ===================== 通用 Menu 样式（SuggestionMenu/MentionMenu/EmojiMenu/默认 menu 共用） =====================
      // 严格按 ui-4 editor-suggestion-menu.ts 实现：
      //   content: min-w-48(192) max-w-60(240) max-h-96(384) bg-default shadow-lg rounded-md ring ring-default overflow-hidden
      //            data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]
      //            origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col
      //   viewport: relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1
      //   group: p-1 isolate
      //   label: w-full flex items-center font-semibold text-highlighted
      //   separator: -mx-1 my-1 h-px bg-border
      //   item: group relative w-full flex items-start select-none outline-none
      //        before:absolute before:z-[-1] before:inset-px before:rounded-md
      //        data-disabled:cursor-not-allowed data-disabled:opacity-75
      //   size md: label p-1.5 text-xs gap-1.5; item p-1.5 text-sm gap-1.5; itemLeadingIcon size-5 text-base
      //   active true: item text-highlighted before:bg-elevated/75; itemLeadingIcon text-default
      //   active false: item text-default data-highlighted:not-data-disabled:text-highlighted
      //                       data-highlighted:not-data-disabled:before:bg-elevated/50
      //                itemLeadingIcon text-dimmed group-data-highlighted:not-group-data-disabled:text-default
      //
      // 关键改动（vs 旧实现）：
      //   1. 容器用 ring（box-shadow 0 0 0 1px）替代 border
      //   2. 用 [data-highlighted] / [data-disabled] / [data-state] 属性选择器替代 :hover
      //   3. 添加 scale-in/scale-out 100ms 动画
      //   4. separator margin 改为 -4px 4px（对应 -mx-1 my-1）
      //   5. label padding 改为 6px（对应 p-1.5）
      //   6. itemLeadingIcon 尺寸 20x20px，字号 16px（对应 size-5 text-base）
      //   7. group padding 4px（对应 p-1）
      // 4 个菜单 root 类名共用同一套样式（ui-4 中 MentionMenu/EmojiMenu 都直接复用 SuggestionMenu 的 theme）
      ...[
        'xy-rich-text-editor-suggestion-menu',
        'xy-rich-text-editor-mention-menu',
        'xy-rich-text-editor-emoji-menu',
        'xy-rich-text-editor-menu',
      ].map(menuCls => {
        // .xy-rich-text-editor-menu__xxx 用双下划线，.xy-rich-text-editor-suggestion-menu-xxx 用单横线
        const isBem = menuCls === 'xy-rich-text-editor-menu';
        const sep = isBem ? '__' : '-';
        const itemCls = `${menuCls}${sep}item`;
        const itemActiveCls = isBem ? `${itemCls}--active` : `${itemCls}-active`;
        const itemLeadingCls = `${menuCls}${sep}item-leading`;
        const itemLeadingAvatarCls = `${itemLeadingCls}-avatar`;
        const itemLeadingIconCls = `${itemLeadingCls}-icon`;
        const itemWrapperCls = `${menuCls}${sep}item-wrapper`;
        const itemLabelCls = `${menuCls}${sep}item-label`;
        const itemDescriptionCls = `${menuCls}${sep}item-description`;
        const viewportCls = `${menuCls}${sep}viewport`;
        const contentCls = `${menuCls}${sep}content`;
        const groupCls = `${menuCls}${sep}group`;
        const labelCls = `${menuCls}${sep}label`;
        const separatorCls = `${menuCls}${sep}separator`;

        // 容器：ring（box-shadow 0 0 0 1px border-secondary）+ 阴影 + 动画
        // 注意：shadow-lg 在 ant 中对应 boxShadowTertiary
        // ring 在 Tailwind v4 中是 box-shadow: 0 0 0 1px var(--ui-border)
        // 两个 shadow 合并：先 ring 后 shadow-lg
        return {
          [menuSelector(menuCls)]: {
            position: 'absolute',
            zIndex: 50,
            minWidth: `${menuMinWidth}px`,
            maxWidth: `${menuMaxWidth}px`,
            maxHeight: `${menuMaxHeight}px`,
            background: colorBgContainer,
            // ring + shadow-lg：合并为单个 box-shadow
            // Tailwind shadow-lg ≈ 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)
            boxShadow: `0 0 0 1px ${colorBorderSecondary}, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`,
            borderRadius: '6px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            // transform-origin：对应 ui-4 origin-(--reka-dropdown-menu-content-transform-origin)
            // 默认为 top-start（菜单通常向下弹出）
            transformOrigin: 'top left',
            // 打开/关闭动画：data-[state=open] scale-in, data-[state=closed] scale-out
            '&[data-state="open"]': {
              animationName: xyEditorMenuScaleIn,
              animationDuration: '100ms',
              animationTimingFunction: 'ease-out',
            },
            '&[data-state="closed"]': {
              animationName: xyEditorMenuScaleOut,
              animationDuration: '100ms',
              animationTimingFunction: 'ease-in',
            },
          },

          // content：内部容器，纯 flex
          [menuSelector(contentCls)]: {
            display: 'flex',
            flexDirection: 'column',
          },

          // viewport：relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1
          [menuSelector(viewportCls)]: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto',
            scrollPaddingY: '4px',
            // divide-y divide-default：子元素之间 1px 上边框
            '& > * + *': {
              borderTop: `1px solid ${colorBorderSecondary}`,
            },
          },

          // group：p-1 isolate
          [menuSelector(groupCls)]: {
            padding: '4px',
            isolate: true,
          },

          // label：w-full flex items-center font-semibold text-highlighted
          // size md: p-1.5 text-xs gap-1.5
          [menuSelector(labelCls)]: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: colorText,
          },

          // separator：-mx-1 my-1 h-px bg-border
          [menuSelector(separatorCls)]: {
            margin: '4px -4px',
            padding: 0,
            height: '1px',
            background: colorBorderSecondary,
          },

          // item（md 尺寸）：group relative w-full flex items-start select-none outline-none
          //   before:absolute before:z-[-1] before:inset-px before:rounded-md
          //   data-disabled:cursor-not-allowed data-disabled:opacity-75
          //   md: p-1.5 text-sm gap-1.5
          //   active false: text-default
          //     data-highlighted:not-data-disabled:text-highlighted
          //     data-highlighted:not-data-disabled:before:bg-elevated/50
          //   active true: text-highlighted before:bg-elevated/75
          [menuSelector(itemCls)]: {
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            userSelect: 'none',
            outline: 'none',
            padding: '6px',
            fontSize: '14px',
            gap: '6px',
            // 默认态：color var(--ui-text)（text-default）
            color: colorText,
            cursor: 'pointer',
            transition: 'color 0.15s ease',
            // ::before 伪元素：实现 hover/active 背景的关键
            '::before': {
              content: '""',
              position: 'absolute',
              inset: '1px',
              borderRadius: '6px',
              zIndex: -1,
              transition: 'background-color 0.15s ease',
            },
            // data-highlighted（鼠标 hover 或键盘选中）：text-highlighted, ::before bg-elevated 50%
            '&[data-highlighted]:not([data-disabled])': {
              color: colorText,
              '::before': { background: itemHoverBg },
            },
            // data-disabled：opacity 0.75, cursor not-allowed
            '&[data-disabled]': {
              opacity: 0.75,
              cursor: 'not-allowed',
            },
          },

          // item active 态（键盘选中 selectedIndex）：text-highlighted, ::before bg-elevated 75%
          // 通过 [data-highlighted] 实现，不需要单独的 itemActiveCls 样式
          // 但保留旧 itemActiveCls 类选择器以向后兼容（如果存在）
          [menuSelector(itemActiveCls)]: {
            color: colorText,
            '::before': { background: itemActiveBg },
          },

          // itemLeading：shrink-0 flex items-center justify-center
          [menuSelector(itemLeadingCls)]: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          },

          // itemLeadingAvatar：shrink-0
          [menuSelector(itemLeadingAvatarCls)]: {
            display: 'inline-flex',
            flexShrink: 0,
          },

          // itemLeadingIcon：size md -> size-5 text-base
          //   size-5 = 20x20px, text-base = 16px
          [menuSelector(itemLeadingIconCls)]: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '20px',
            height: '20px',
            fontSize: '16px',
            // active false: text-dimmed（Nuxt UI 可读性，使用 colorTextSecondary）
            //   group-data-highlighted:not-group-data-disabled:text-default
            color: colorTextSecondary,
            transition: 'color 0.15s ease',
            // 父 item[data-highlighted] 时，icon 颜色变为 text-default
            [`${menuSelector(itemCls)}[data-highlighted]:not([data-disabled]) &`]: {
              color: colorText,
            },
          },

          // itemWrapper：flex-1 flex flex-col text-start min-w-0
          [menuSelector(itemWrapperCls)]: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
            minWidth: 0,
          },

          // itemLabel：truncate（text-sm）
          [menuSelector(itemLabelCls)]: {
            fontSize: '14px',
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },

          // itemDescription：truncate text-muted
          [menuSelector(itemDescriptionCls)]: {
            fontSize: '12px',
            color: colorTextSecondary,
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        } as CSSObject;
      }),

      // ===================== RichTextEditorEmojiMenu grid 布局变体 =====================
      // ui-4 没有这个变体，是 XiaoyeUI 自定义的（用于 emoji 网格布局）
      {
        '.xy-rich-text-editor-emoji-menu-group--grid': {
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: `${marginXXS}px`,
          // grid 模式下 item 居中显示 emoji，不显示文字 label
          '.xy-rich-text-editor-emoji-menu-item': {
            padding: `${marginXXS}px`,
            justifyContent: 'center',
            borderRadius: '6px',
          },
          '.xy-rich-text-editor-emoji-menu-item-leading-icon': {
            fontSize: `${fontSizeXL}px`,
            lineHeight: 1,
            width: 'auto',
            height: 'auto',
          },
          '.xy-rich-text-editor-emoji-menu-item-wrapper': {
            display: 'none',
          },
        },
      } as CSSObject,

      // Keyframes 对象已在文件顶部定义，cssinjs 会自动注入对应的 @keyframes
    ];
  },
  // 默认 ComponentToken 值（ui-4 精确值）
  {
    contentPadding: 32,
    contentPaddingInline: 32,
    contentPaddingBlock: 54,
    contentMinHeight: 84,
    toolbarButtonHeight: 28,
    toolbarButtonSize: 28,
    toolbarButtonGap: 6,
    toolbarGroupGap: 2,
    menuMinWidth: 192,
    menuMaxWidth: 240,
    menuMaxHeight: 384,
    linkPopoverMinWidth: 320,
  } as any,
);
