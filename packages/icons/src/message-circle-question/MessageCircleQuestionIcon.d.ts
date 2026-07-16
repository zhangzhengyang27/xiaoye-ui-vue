import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MessageCircleQuestionIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MessageCircleQuestionIcon: DefineComponent<MessageCircleQuestionIcon>;
  }
}

export default MessageCircleQuestionIcon;
