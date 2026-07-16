import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class DollarSignIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    DollarSignIcon: DefineComponent<DollarSignIcon>;
  }
}

export default DollarSignIcon;
