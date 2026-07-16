import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MailIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MailIcon: DefineComponent<MailIcon>;
  }
}

export default MailIcon;
