import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MessageSquareIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MessageSquareIcon: DefineComponent<MessageSquareIcon>;
  }
}

export default MessageSquareIcon;
