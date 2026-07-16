import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MessageCircleIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MessageCircleIcon: DefineComponent<MessageCircleIcon>;
  }
}

export default MessageCircleIcon;
