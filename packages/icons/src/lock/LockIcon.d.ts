import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LockIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    LockIcon: DefineComponent<LockIcon>;
  }
}

export default LockIcon;
