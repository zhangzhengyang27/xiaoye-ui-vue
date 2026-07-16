import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MousePointerClickIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MousePointerClickIcon: DefineComponent<MousePointerClickIcon>;
  }
}

export default MousePointerClickIcon;
