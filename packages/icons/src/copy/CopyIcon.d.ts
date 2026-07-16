import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CopyIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CopyIcon: DefineComponent<CopyIcon>;
  }
}

export default CopyIcon;
