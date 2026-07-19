import type { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

export interface ComponentToken {
  starColor?: string;
  starSize?: number;
}

export interface RatingToken extends FullToken<'Rating'> {
  ratingStarColor: string;
  ratingStarSize: number;
}

const genRatingStyle: GenerateStyle<RatingToken> = token => {
  const { componentCls, colorTextDisabled, colorTextSecondary, fontSizeIcon, motionDurationFast } =
    token;

  return {
    [componentCls]: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: token.marginXXS,
      outline: 'none',

      [`${componentCls}-star`]: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: `all ${motionDurationFast}`,

        [`${componentCls}-input`]: {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          margin: 0,
          zIndex: 1,
        },

        [`${componentCls}-character`]: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: fontSizeIcon,
          color: colorTextSecondary,
          transition: `all ${motionDurationFast}`,
        },

        [`&${componentCls}-star-active ${componentCls}-character`]: {
          color: token.ratingStarColor,
        },

        [`&${componentCls}-star-focused ${componentCls}-character`]: {
          transform: 'scale(1.1)',
        },

        '&:hover': {
          [`${componentCls}-character`]: {
            transform: 'scale(1.1)',
          },
        },
      },

      [`&${componentCls}-disabled ${componentCls}-star, &${componentCls}-readonly ${componentCls}-star`]:
        {
          cursor: 'not-allowed',

          [`${componentCls}-input`]: {
            cursor: 'not-allowed',
          },

          [`${componentCls}-character`]: {
            color: colorTextDisabled,
          },
        },

      [`&${componentCls}-disabled ${componentCls}-star-active ${componentCls}-character`]: {
        color: colorTextDisabled,
      },
    },
  } as CSSObject;
};

export default genComponentStyleHook('Rating', token => {
  const ratingToken = mergeToken<RatingToken>(token, {
    ratingStarColor: token.colorPrimary,
    ratingStarSize: token.fontSizeIcon,
  });
  return [genRatingStyle(ratingToken)];
});
