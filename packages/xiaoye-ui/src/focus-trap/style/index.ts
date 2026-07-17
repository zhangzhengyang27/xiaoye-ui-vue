import type { CSSObject } from '../../_util/cssinjs';
import { genComponentStyleHook } from '../../theme/internal';

export interface ComponentToken {}

// 迁移自源项目 focustrap/style/index.ts，去掉第三参数
export default genComponentStyleHook('FocusTrap', () => {
  return {
    '.xy-hidden-accessible': {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      whiteSpace: 'nowrap',
      border: 0,
    },
    '.xy-hidden-focusable': { outline: 0 },
  } as CSSObject;
});
