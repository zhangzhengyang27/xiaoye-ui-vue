import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ChevronDownIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ChevronDownIcon: DefineComponent<ChevronDownIcon>;
  }
}

export default ChevronDownIcon;
