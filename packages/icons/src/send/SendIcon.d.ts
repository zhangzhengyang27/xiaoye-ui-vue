import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SendIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SendIcon: DefineComponent<SendIcon>;
  }
}

export default SendIcon;
