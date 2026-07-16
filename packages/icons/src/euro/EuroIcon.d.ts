import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class EuroIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    EuroIcon: DefineComponent<EuroIcon>;
  }
}

export default EuroIcon;
