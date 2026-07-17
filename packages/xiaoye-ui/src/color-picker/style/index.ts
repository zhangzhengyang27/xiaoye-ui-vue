import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

export default genComponentStyleHook('ColorPicker', token => {
  const {
    componentCls,
    borderRadius,
    colorPrimary,
    colorBgContainer,
    colorBorder,
    boxShadow,
    colorText,
  } = token;

  const transitionDuration = '0.2s';
  const inputFocusShadow = `0 0 0 2px color-mix(in srgb, ${colorPrimary} 20%, transparent)`;

  return {
    [componentCls]: {
      position: 'relative',
      display: 'inline-block',

      '&-dragging': {
        cursor: 'pointer',
      },

      '&-inline': {
        [`${componentCls}-panel`]: {
          position: 'static',
          boxShadow: 'none',
        },
      },

      '&-disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',

        [`${componentCls}-preview`]: {
          cursor: 'not-allowed',
        },
      },

      [`&-preview`]: {
        width: '2rem',
        height: '2rem',
        padding: 0,
        border: '0 none',
        borderRadius,
        outlineColor: 'transparent',
        cursor: 'pointer',
        transition: `background ${transitionDuration}, color ${transitionDuration}, border-color ${transitionDuration}, outline-color ${transitionDuration}, box-shadow ${transitionDuration}`,

        '&:enabled:focus-visible': {
          borderColor: colorPrimary,
          boxShadow: inputFocusShadow,
          outline: `1px solid ${colorPrimary}`,
          outlineOffset: '1px',
        },
      },

      [`&-panel`]: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '193px',
        height: '166px',
        background: colorBgContainer,
        border: `1px solid ${colorBorder}`,
        borderRadius,
        boxShadow,
      },

      [`&-content`]: {
        position: 'relative',
      },

      [`&-color-selector`]: {
        position: 'absolute',
        top: '8px',
        left: '8px',
        width: '150px',
        height: '150px',
      },

      [`&-color-background`]: {
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%)',
      },

      [`&-color-handle`]: {
        position: 'absolute',
        top: 0,
        left: '150px',
        width: '10px',
        height: '10px',
        margin: '-5px 0 0 -5px',
        border: `1px solid ${colorText}`,
        borderRadius: '100%',
        cursor: 'pointer',
        opacity: 0.85,
      },

      [`&-hue`]: {
        position: 'absolute',
        top: '8px',
        left: '167px',
        width: '17px',
        height: '150px',
        background:
          'linear-gradient(0deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red)',
        opacity: 0.85,
      },

      [`&-hue-handle`]: {
        position: 'absolute',
        top: '150px',
        left: 0,
        width: '21px',
        height: '10px',
        marginTop: '-5px',
        marginLeft: '-2px',
        border: `2px solid ${colorText}`,
        cursor: 'pointer',
        opacity: 0.85,
      },
    },
  } as CSSObject;
});
