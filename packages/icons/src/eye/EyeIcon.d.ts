import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class EyeIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    EyeIcon: DefineComponent<EyeIcon>;
  }
}

export default EyeIcon;
