import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

// 合并 RichTextEditor 主组件 + 5 个子组件（Toolbar/DragHandle/MentionMenu/EmojiMenu/SuggestionMenu）
// 的样式到一个 hook 中。
// 修复 bug：源项目子组件仅 `import './style'` 未调用 useStyle，
// 导致 `genComponentStyleHook` 返回的函数未执行，子组件样式不会注册。
// 这里通过主组件 useStyle 一次性注册所有样式，子组件样式使用绝对类名选择器。
export default genComponentStyleHook('RichTextEditor', token => {
  const {
    componentCls,
    colorBgContainer,
    colorBorder,
    borderRadius,
    borderRadiusSM,
    borderRadiusLG,
    colorTextSecondary,
    colorText,
    colorBgLayout,
    colorBorderSecondary,
    boxShadow,
    boxShadowTertiary,
    paddingMD,
    paddingXS,
    paddingSM,
    colorPrimary,
    colorTextLightSolid,
  } = token;

  const cp = colorPrimary || '#1677ff';
  const focusShadow = `0 0 0 2px color-mix(in srgb, ${cp} 20%, transparent)`;
  const activeBg = `color-mix(in srgb, ${cp} 12%, transparent)`;

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

        '&-content': {
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          minHeight: '5.25rem',

          '.ProseMirror': {
            outline: 'none',
            width: '100%',
            minHeight: '100%',
            padding: '1rem',
            color: 'inherit',
            fontSize: '1rem',
            lineHeight: 1.75,

            '@media (min-width: 640px)': {
              paddingInline: '2rem',
            },

            '> *': { marginBlock: '1.25rem' },
            '> :first-child': { marginTop: 0 },
            '> :last-child': { marginBottom: 0 },

            p: { margin: 0, lineHeight: 1.75 },

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

            h1: { fontSize: '1.875rem', lineHeight: '2.25rem' },
            h2: { fontSize: '1.5rem', lineHeight: '2rem' },
            h3: { fontSize: '1.25rem', lineHeight: '1.75rem' },

            blockquote: {
              borderInlineStart: `4px solid ${cp}`,
              paddingLeft: '1rem',
              margin: '1.25rem 0',
              color: colorTextSecondary,
              fontStyle: 'italic',
            },

            'ul, ol': { paddingLeft: '1.5rem', margin: '1.25rem 0' },
            li: { marginBottom: '0.25rem' },

            code: {
              background: colorBgLayout,
              color: cp,
              padding: '0.2rem 0.4rem',
              borderRadius: `${borderRadius}px`,
              fontSize: '0.875rem',
              fontFamily: 'monospace',
            },

            pre: {
              background: colorBgLayout,
              color: colorText,
              borderRadius: `${borderRadius}px`,
              padding: '1rem',
              overflowX: 'auto',
              margin: '1.25rem 0',

              code: {
                background: 'none',
                color: 'inherit',
                padding: 0,
                fontSize: '0.875rem',
              },
            },

            img: {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: `${borderRadius}px`,
              margin: '1.25rem 0',
            },

            hr: {
              border: 'none',
              borderTop: `1px solid ${colorBorder}`,
              margin: '1.25rem 0',
            },

            table: {
              width: '100%',
              borderCollapse: 'collapse',
              margin: '1.25rem 0',

              'th, td': {
                border: `1px solid ${colorBorder}`,
                padding: '0.5rem 0.75rem',
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
          },

          '&-placeholder': {
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            color: colorTextSecondary,
            fontSize: '1rem',
            lineHeight: '1.75rem',
            pointerEvents: 'none',
            opacity: 0.5,
          },

          '@media (min-width: 640px)': {
            '&-placeholder': {
              left: '2rem',
            },
          },
        },

        '&-link-popover': {
          position: 'absolute',
          zIndex: 50,
          background: colorBgContainer,
          border: `1px solid ${colorBorder}`,
          borderRadius: `${borderRadiusLG}px`,
          boxShadow,
          minWidth: '20rem',
          padding: `${paddingMD}px`,

          '&-header': {
            display: 'flex',
            alignItems: 'center',
            gap: `${paddingXS}px`,
            marginBottom: `${paddingSM}px`,
            color: colorText,
            fontSize: '0.875rem',
            fontWeight: 500,
          },

          '&-header-icon': {
            color: colorTextSecondary,
            width: '1rem',
            height: '1rem',
          },

          '&-input-wrapper': {
            marginBottom: `${paddingSM}px`,
          },

          '&-input': {
            width: '100%',
            height: '2.25rem',
            padding: `0 ${paddingSM}px`,
            border: `1px solid ${colorBorder}`,
            borderRadius: `${borderRadius}px`,
            fontSize: '0.875rem',
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
            height: '2rem',
            padding: `0 ${paddingSM}px`,
            border: 'none',
            borderRadius: `${borderRadius}px`,
            cursor: 'pointer',
            fontSize: '0.875rem',
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
    {
      '.xy-rich-text-editor-toolbar': {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.5rem',
        background: colorBgContainer,
        borderBottom: `1px solid ${colorBorder}`,

        '&[data-layout="bubble"], &[data-layout="floating"]': {
          position: 'absolute',
          zIndex: 10,
          padding: '0.25rem 0.375rem',
          borderRadius: `${borderRadius}px`,
          boxShadow,
          border: `1px solid ${colorBorder}`,
        },

        '&-base': { display: 'flex', alignItems: 'center', gap: '0.25rem' },
        '&-group': { display: 'flex', alignItems: 'center', gap: '0.125rem' },
        '&-group-separator': {
          width: '1px',
          height: '1.25rem',
          background: colorBorder,
          margin: '0 0.25rem',
          flexShrink: 0,
        },
        '&-separator': {
          width: '1px',
          height: '1rem',
          background: colorBorder,
          margin: '0 0.125rem',
        },
        '&-label': {
          padding: '0 0.5rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: colorTextSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: '1.75rem',
          whiteSpace: 'nowrap',
        },
        '&-button': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.375rem',
          height: '2rem',
          minWidth: '2rem',
          padding: '0 0.5rem',
          fontSize: '0.875rem',
          lineHeight: 1,
          color: colorTextSecondary,
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: `${borderRadiusSM}px`,
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
          userSelect: 'none',
          outline: 'none',
          '&:hover:not(:disabled)': { background: colorBgLayout, color: colorText },
          '&:focus-visible': { boxShadow: `0 0 0 2px ${cp}` },
          '&-active': { background: activeBg, color: cp },
          '&-disabled': { opacity: 0.4, cursor: 'not-allowed' },
        },
        '&-icon': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1rem',
          height: '1rem',
          flexShrink: 0,
          'svg,img': { width: '100%', height: '100%' },
        },
        '&-dropdown': { position: 'relative', display: 'inline-flex' },
        '&-dropdown-arrow': {
          width: '0.75rem',
          height: '0.75rem',
          opacity: 0.6,
          transition: 'transform 0.2s ease',
        },
        '&-dropdown-panel': {
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          minWidth: '11rem',
          maxHeight: '18.75rem',
          overflowY: 'auto',
          zIndex: 50,
          padding: '4px',
          background: colorBgContainer,
          border: `1px solid ${colorBorder}`,
          borderRadius: `${borderRadius}px`,
          boxShadow,
        },
        '&-dropdown-group': { padding: '0.125rem 0' },
        '&-dropdown-group-separator': {
          height: '1px',
          margin: '0.25rem 0.5rem',
          background: colorBorder,
        },
        '&-dropdown-separator': {
          height: '1px',
          margin: '0.125rem 0.5rem',
          background: colorBorder,
        },
        '&-dropdown-label': {
          padding: '0.375rem 0.75rem',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: colorTextSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: '1.25rem',
        },
        '&-dropdown-item': {
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.375rem 0.75rem',
          fontSize: '0.875rem',
          lineHeight: 1.25,
          color: colorTextSecondary,
          background: 'transparent',
          border: 'none',
          borderRadius: `${borderRadiusSM}px`,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
          outline: 'none',
          '&:hover:not(:disabled)': { background: colorBgLayout, color: colorText },
          '&:focus-visible': { boxShadow: `0 0 0 2px ${cp}` },
          '&-active': { background: activeBg, color: cp },
          '&-disabled': { opacity: 0.4, cursor: 'not-allowed' },
        },
      },

      '.xy-rich-text-editor-toolbar-tooltip': {
        position: 'absolute',
        zIndex: 9999,
        padding: '6px 12px',
        fontSize: '13px',
        lineHeight: '18px',
        fontWeight: 500,
        color: colorText,
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius: '8px',
        whiteSpace: 'nowrap',
        pointerEvents: 'auto',
        userSelect: 'none',
        boxShadow: boxShadowTertiary,
        '&-top': { transform: 'translate(-50%, -100%)', marginTop: '-6px' },
        '&-bottom': { transform: 'translate(-50%, 0)', marginTop: '6px' },
        '&-left': { transform: 'translate(-100%, -50%)', marginLeft: '-6px' },
        '&-right': { transform: 'translate(0, -50%)', marginLeft: '6px' },
        '&-arrow': {
          position: 'absolute',
          width: '6px',
          height: '6px',
          background: colorBgContainer,
          borderRight: `1px solid ${colorBorder}`,
          borderBottom: `1px solid ${colorBorder}`,
          rotate: '45deg',
        },
        '&-top &-arrow': { bottom: '-3px', left: '50%', marginLeft: '-3px' },
        '&-bottom &-arrow': { top: '-3px', left: '50%', marginLeft: '-3px', rotate: '225deg' },
        '&-left &-arrow': { right: '-3px', top: '50%', marginTop: '-3px', rotate: '-45deg' },
        '&-right &-arrow': { left: '-3px', top: '50%', marginTop: '-3px', rotate: '135deg' },
      },

      '.xy-dropdown-enter-active, .xy-dropdown-leave-active': {
        transition: 'opacity 0.15s ease, transform 0.15s ease',
      },
      '.xy-dropdown-enter-from, .xy-dropdown-leave-to': {
        opacity: 0,
        transform: 'scale(0.95)',
      },
      '.tooltip-enter-active, .tooltip-leave-active': {
        transition: 'opacity 0.15s, transform 0.15s',
      },
      '.tooltip-enter-from, .tooltip-leave-to': {
        opacity: 0,
      },
    } as CSSObject,

    // ===================== RichTextEditorDragHandle =====================
    {
      '.xy-rich-text-editor-drag-handle': {
        position: 'absolute',
        zIndex: 1,
        opacity: 0,
        transition: 'opacity 0.15s ease',
        pointerEvents: 'none',
        '&[data-state="visible"]': { opacity: 1, pointerEvents: 'auto' },
        '&-handle': {
          cursor: 'grab',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          color: colorTextSecondary,
          width: '1.5rem',
          height: '1.5rem',
          '&:hover': { color: colorText },
          '&:active': { cursor: 'grabbing' },
        },
      },
    } as CSSObject,

    // ===================== RichTextEditorSuggestionMenu =====================
    {
      '.xy-rich-text-editor-suggestion-menu': {
        position: 'absolute',
        zIndex: 50,
        minWidth: '12rem',
        maxHeight: '18rem',
        overflowY: 'auto',
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius: `${borderRadius}px`,
        boxShadow,
        padding: `${paddingXS}px 0`,
        '&-content': { display: 'block' },
        '&-viewport': { display: 'block' },
        '&-group': { display: 'block' },
        '&-label': {
          padding: '0.25rem 0.75rem',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: colorTextSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        '&-separator': {
          height: '1px',
          margin: '0.25rem 0.5rem',
          background: colorBorderSecondary,
        },
        '&-item': {
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: colorText,
          transition: 'background-color 0.15s ease',
          '&:hover,&-hover': { background: colorBgLayout },
          '&-active': { background: activeBg },
          '&-disabled': { opacity: 0.4, cursor: 'not-allowed' },
        },
        '&-item-leading': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        '&-item-leading-icon': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        '&-item-wrapper': { display: 'flex', flexDirection: 'column', gap: '0.125rem' },
        '&-item-label': { fontSize: '0.875rem', lineHeight: 1.25 },
        '&-item-description': {
          fontSize: '0.75rem',
          color: colorTextSecondary,
          lineHeight: 1.25,
        },
        '&-empty': {
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          color: colorTextSecondary,
          textAlign: 'center',
        },
      },
    } as CSSObject,

    // ===================== RichTextEditorMentionMenu =====================
    {
      '.xy-rich-text-editor-mention-menu': {
        position: 'absolute',
        zIndex: 50,
        minWidth: '12rem',
        maxHeight: '18rem',
        overflowY: 'auto',
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius: `${borderRadius}px`,
        boxShadow,
        padding: `${paddingXS}px 0`,
        '&-content': { display: 'block' },
        '&-viewport': { display: 'block' },
        '&-group': { display: 'block' },
        '&-label': {
          padding: '0.25rem 0.75rem',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: colorTextSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        '&-separator': {
          height: '1px',
          margin: '0.25rem 0.5rem',
          background: colorBorderSecondary,
        },
        '&-item': {
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: colorText,
          transition: 'background-color 0.15s ease',
          '&:hover,&-hover': { background: colorBgLayout },
          '&-active': {
            background: activeBg,
            '& > *': { color: cp },
          },
          '&-disabled': { opacity: 0.4, cursor: 'not-allowed' },
        },
        '&-item-leading': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        '&-item-leading-avatar': { display: 'inline-flex', flexShrink: 0 },
        '&-item-leading-icon': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        '&-item-wrapper': { display: 'flex', flexDirection: 'column', gap: '0.125rem' },
        '&-item-label': { fontSize: '0.875rem', lineHeight: 1.25 },
        '&-item-description': {
          fontSize: '0.75rem',
          color: colorTextSecondary,
          lineHeight: 1.25,
        },
        '&-empty': {
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          color: colorTextSecondary,
          textAlign: 'center',
        },
      },
    } as CSSObject,

    // ===================== RichTextEditorEmojiMenu =====================
    {
      '.xy-rich-text-editor-emoji-menu': {
        position: 'absolute',
        zIndex: 50,
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius: `${borderRadius}px`,
        boxShadow,
        padding: '0.5rem',
        maxWidth: '20rem',
        '&-content': { display: 'block' },
        '&-viewport': { display: 'block' },
        '&-group': { display: 'block' },
        '&-grid': {
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '0.25rem',
        },
        '&-item': {
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: colorText,
          transition: 'background-color 0.15s ease',
          '&:hover,&-hover': { background: colorBgLayout },
          '&-active': { background: activeBg },
          '&-disabled': { opacity: 0.4, cursor: 'not-allowed' },
        },
        '&-item-leading': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        '&-item-leading-icon': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '1.25rem',
        },
        '&-item-wrapper': { display: 'flex', flexDirection: 'column', gap: '0.125rem' },
        '&-item-label': { fontSize: '0.875rem', lineHeight: 1.25 },
      },
    } as CSSObject,

    // ===================== 通用 Menu 类（useEditorMenu 默认 classes） =====================
    {
      '.xy-rich-text-editor-menu': {
        position: 'absolute',
        zIndex: 50,
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius: `${borderRadius}px`,
        boxShadow,
        padding: `${paddingXS}px 0`,
        minWidth: '12rem',
        maxHeight: '18rem',
        overflowY: 'auto',
      },
      '.xy-rich-text-editor-menu__content': { display: 'block' },
      '.xy-rich-text-editor-menu__viewport': { display: 'block' },
      '.xy-rich-text-editor-menu__group': { display: 'block' },
      '.xy-rich-text-editor-menu__label': {
        padding: '0.25rem 0.75rem',
        fontSize: '0.7rem',
        fontWeight: 600,
        color: colorTextSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      },
      '.xy-rich-text-editor-menu__separator': {
        height: '1px',
        margin: '0.25rem 0.5rem',
        background: colorBorderSecondary,
      },
      '.xy-rich-text-editor-menu__item': {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.375rem 0.75rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        color: colorText,
        transition: 'background-color 0.15s ease',
        '&:hover': { background: colorBgLayout },
      },
      '.xy-rich-text-editor-menu__item--active': { background: activeBg },
      '.xy-rich-text-editor-menu__item-leading': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      },
      '.xy-rich-text-editor-menu__item-leading-avatar': {
        display: 'inline-flex',
        flexShrink: 0,
      },
      '.xy-rich-text-editor-menu__item-leading-icon': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      },
      '.xy-rich-text-editor-menu__item-wrapper': {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.125rem',
      },
      '.xy-rich-text-editor-menu__item-label': {
        fontSize: '0.875rem',
        lineHeight: 1.25,
      },
      '.xy-rich-text-editor-menu__item-description': {
        fontSize: '0.75rem',
        color: colorTextSecondary,
        lineHeight: 1.25,
      },
    } as CSSObject,
  ];
});
