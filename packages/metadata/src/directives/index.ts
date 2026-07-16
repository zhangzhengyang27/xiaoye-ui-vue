import type { MetaType } from '../shared.ts';
import { toMeta } from '../shared.ts';

export const directives: MetaType[] = toMeta([
  { name: 'badge', as: 'BadgeDirective', from: 'xiaoye-ui/badgedirective' },
  { name: 'tooltip', as: 'Tooltip', from: 'xiaoye-ui/tooltip' },
  { name: 'styleclass', as: 'StyleClass', from: 'xiaoye-ui/styleclass' },
  { name: 'focustrap', as: 'FocusTrap', from: 'xiaoye-ui/focustrap' },
  { name: 'animateonscroll', as: 'AnimateOnScroll', from: 'xiaoye-ui/animateonscroll' },
  { name: 'keyfilter', as: 'KeyFilter', from: 'xiaoye-ui/keyfilter' },
]);
