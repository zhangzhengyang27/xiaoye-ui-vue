import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class RefreshIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    RefreshIcon: DefineComponent<RefreshIcon>;
  }
}

export default RefreshIcon;
