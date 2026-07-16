import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class InfoIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    InfoIcon: DefineComponent<InfoIcon>;
  }
}

export default InfoIcon;
