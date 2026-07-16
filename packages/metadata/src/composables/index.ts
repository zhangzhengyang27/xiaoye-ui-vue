import type { MetaType } from '../shared.ts';
import { toMeta } from '../shared.ts';

export const composables: MetaType[] = toMeta([
  { name: 'useXiaoyeUI', as: 'useXiaoyeUI', from: 'xiaoye-ui/config' },
  { name: 'useConfirm', as: 'useConfirm', from: 'xiaoye-ui/useconfirm' },
  { name: 'useDialog', as: 'useDialog', from: 'xiaoye-ui/usedialog' },
]);
