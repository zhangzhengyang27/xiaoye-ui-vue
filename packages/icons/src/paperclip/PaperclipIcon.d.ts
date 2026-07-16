import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PaperclipIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    PaperclipIcon: DefineComponent<PaperclipIcon>;
  }
}

export default PaperclipIcon;
