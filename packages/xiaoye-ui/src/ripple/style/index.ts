import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

// 组件专属 Token（占位）
export interface ComponentToken {}

// 迁移自源项目 ripple/style/index.ts，去掉第三参数（按任务 0.3 决策）
export default genComponentStyleHook('Ripple', () => {
  return {
    '@keyframes xy-ripple-animation': {
      '100%': { opacity: 0, transform: 'scale(2.5)' },
    },
    '.xy-ripple': {
      position: 'relative',
      overflow: 'hidden',
      '&__ink': {
        display: 'block',
        position: 'absolute',
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '100%',
        transform: 'scale(0)',
        pointerEvents: 'none',
        '&--active': {
          animationName: 'xy-ripple-animation',
          animationDuration: '0.4s',
          animationTimingFunction: 'linear',
        },
      },
    },
  } as CSSObject;
});
