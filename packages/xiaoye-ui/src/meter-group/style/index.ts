import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

export interface ComponentToken {
  /** 进度条轨道高度 */
  meterTrackSize?: number;
  /** 标签与轨道之间的间距 */
  meterGap?: number;
  /** 轨道背景色 */
  meterTrackColor?: string;
}

interface MeterGroupToken extends FullToken<'MeterGroup'> {
  meterTrackSize: number;
  meterGap: number;
  meterTrackColor: string;
}

const genBaseStyle: GenerateStyle<MeterGroupToken, CSSObject> = token => {
  const { componentCls, meterTrackColor, borderRadius, meterTrackSize, meterGap } = token;

  return {
    [componentCls]: {
      display: 'flex',
      gap: meterGap,

      [`&${componentCls}-horizontal`]: {
        flexDirection: 'column',
      },

      [`&${componentCls}-vertical`]: {
        flexDirection: 'row',
      },

      [`${componentCls}-meters`]: {
        display: 'flex',
        background: meterTrackColor,
        borderRadius,
      },

      [`&${componentCls}-horizontal ${componentCls}-meters`]: {
        height: meterTrackSize,
      },

      [`&${componentCls}-horizontal ${componentCls}-meter:first-of-type`]: {
        borderStartStartRadius: borderRadius,
        borderEndStartRadius: borderRadius,
      },

      [`&${componentCls}-horizontal ${componentCls}-meter:last-of-type`]: {
        borderStartEndRadius: borderRadius,
        borderEndEndRadius: borderRadius,
      },

      [`&${componentCls}-vertical ${componentCls}-meters`]: {
        flexDirection: 'column',
        width: meterTrackSize,
        height: '100%',
      },

      [`&${componentCls}-vertical ${componentCls}-label-list`]: {
        alignItems: 'flex-start',
      },

      [`&${componentCls}-vertical ${componentCls}-meter:first-of-type`]: {
        borderStartStartRadius: borderRadius,
        borderStartEndRadius: borderRadius,
      },

      [`&${componentCls}-vertical ${componentCls}-meter:last-of-type`]: {
        borderEndStartRadius: borderRadius,
        borderEndEndRadius: borderRadius,
      },

      [`${componentCls}-label-list`]: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: 0,
        padding: 0,
        listStyleType: 'none',

        [`&${componentCls}-label-list-horizontal`]: {
          gap: meterGap,
        },

        [`&${componentCls}-label-list-vertical`]: {
          flexDirection: 'column',
          gap: token.marginXS,
        },
      },

      [`${componentCls}-label`]: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: token.marginXS,
      },

      [`${componentCls}-label-marker`]: {
        display: 'inline-flex',
        width: meterTrackSize,
        height: meterTrackSize,
        borderRadius: '100%',
      },

      [`${componentCls}-label-icon`]: {
        fontSize: token.fontSize,
        width: token.fontSize,
        height: token.fontSize,
      },
    },
  } as CSSObject;
};

export default genComponentStyleHook('MeterGroup', token => {
  const meterGroupToken = mergeToken<MeterGroupToken>(token, {
    // 轨道高度：基于字号派生，与文字基线协调
    meterTrackSize: Math.round(token.fontSize / 2),
    meterGap: token.marginMD,
    // 轨道背景色：复用 progress 的剩余色，保持视觉一致
    meterTrackColor: token.colorFillSecondary,
  });
  return [genBaseStyle(meterGroupToken)];
});
