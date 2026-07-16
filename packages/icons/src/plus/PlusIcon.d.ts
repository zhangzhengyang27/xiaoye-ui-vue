import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PlusIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    PlusIcon: DefineComponent<PlusIcon>;
  }
}

export default PlusIcon;
