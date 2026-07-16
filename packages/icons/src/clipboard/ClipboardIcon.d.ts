import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ClipboardIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ClipboardIcon: DefineComponent<ClipboardIcon>;
  }
}

export default ClipboardIcon;
