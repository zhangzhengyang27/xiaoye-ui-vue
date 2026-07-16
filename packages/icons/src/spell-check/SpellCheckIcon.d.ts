import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SpellCheckIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SpellCheckIcon: DefineComponent<SpellCheckIcon>;
  }
}

export default SpellCheckIcon;
