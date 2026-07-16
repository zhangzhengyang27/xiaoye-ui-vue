import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class VimeoIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    VimeoIcon: DefineComponent<VimeoIcon>;
  }
}

export default VimeoIcon;
