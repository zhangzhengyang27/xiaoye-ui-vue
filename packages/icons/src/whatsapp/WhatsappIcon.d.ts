import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class WhatsappIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    WhatsappIcon: DefineComponent<WhatsappIcon>;
  }
}

export default WhatsappIcon;
