import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class HashIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    HashIcon: DefineComponent<HashIcon>;
  }
}

export default HashIcon;
