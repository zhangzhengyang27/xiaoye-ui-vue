import type { AliasToken, GenerateStyle } from '../../theme/internal';
import type { TokenWithCommonCls } from '../../theme/util/genComponentStyleHook';

const genCollapseMotion: GenerateStyle<TokenWithCommonCls<AliasToken>> = token => ({
  [token.componentCls]: {
    // For common/openAnimation
    [`${token.rootCls}-motion-collapse-legacy`]: {
      overflow: 'hidden',

      '&-active': {
        transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`,
      },
    },

    [`${token.rootCls}-motion-collapse`]: {
      overflow: 'hidden',
      transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`,
    },
  },
});

export default genCollapseMotion;
