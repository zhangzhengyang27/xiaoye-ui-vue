import type { DropdownToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genButtonStyle: GenerateStyle<DropdownToken> = token => {
  const { componentCls, rootCls, paddingXS, opacityLoading } = token;

  return {
    [`${componentCls}-button`]: {
      whiteSpace: 'nowrap',

      [`&${rootCls}-btn-group > ${rootCls}-btn`]: {
        [`&-loading, &-loading + ${rootCls}-btn`]: {
          cursor: 'default',
          pointerEvents: 'none',
          opacity: opacityLoading,
        },

        [`&:last-child:not(:first-child):not(${rootCls}-btn-icon-only)`]: {
          paddingInline: paddingXS,
        },
      },
    },
  };
};

export default genButtonStyle;
