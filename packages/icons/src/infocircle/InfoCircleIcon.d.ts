import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class InfoCircleIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    InfoCircleIcon: DefineComponent<InfoCircleIcon>;
  }
}

export default InfoCircleIcon;
